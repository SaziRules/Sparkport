import { supabase } from './client';
import { uploadPrescriptionImage } from './storage';
import { calculateTier } from '@/lib/rewards';
import { createPrescriptionRecord, deletePrescriptionRecord } from '@/app/actions/prescriptions';

interface PrescriptionFormData {
  // Personal Details
  firstName: string;
  lastName: string;
  email: string;
  whatsappNumber: string;
  idNumber: string;
  dateOfBirth: string;
  preferredContact: string;
  
  // Prescription File
  prescriptionFile: File | null;
  
  // Doctor Information (NEW)
  doctorName: string;
  doctorPracticeNumber: string;
  prescriptionDate: string;
  
  // Chronic Medication (NEW)
  isChronic: boolean;
  chronicRepeats: string;
  
  // Delivery/Collection
  deliveryMethod: 'collection' | 'delivery';
  preferredPharmacyId: string;  // CHANGED from collectionStore - now UUID
  
  // Delivery Address
  streetAddress: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  
  // Medical & Payment
  paymentType: string;
  medicalAidProvider: string;
  medicalAidNumber: string;
  dependantCode: string;
  
  // Additional
  replaceWithGenerics: boolean;
  hasAllergies: boolean;
  allergyDetails: string;
  additionalNotes: string;
}

interface SubmissionResult {
  success: boolean;
  prescriptionId?: string;
  prescriptionNumber?: string;
  error?: string;
}

/**
 * Map payment type to payment status enum
 */
function mapPaymentType(paymentType: string): 'pending' | 'paid' | 'medical_aid' | 'failed' {
  if (paymentType === 'medical-aid') return 'medical_aid';
  return 'pending';
}

/**
 * Build special instructions from form data
 */
function buildSpecialInstructions(formData: PrescriptionFormData): string {
  const instructions = [
    formData.additionalNotes,
    formData.replaceWithGenerics ? 'Replace with generics where possible' : 'Do not replace with generics',
    formData.hasAllergies ? `ALLERGIES: ${formData.allergyDetails}` : null,
    formData.dependantCode ? `Medical Aid Dependant: ${formData.dependantCode}` : null,
    `Preferred contact method: ${formData.preferredContact}`,
  ].filter(Boolean);

  return instructions.join(' | ');
}

/**
 * Submit prescription WITHOUT authentication requirement
 * Works for both logged-in users and anonymous submissions
 */
export async function submitPrescriptionNoAuth(
  formData: PrescriptionFormData,
  email?: string
): Promise<SubmissionResult> {
  try {
    // Get current user (if logged in) - but don't require it
    const { data: { user } } = await supabase.auth.getUser();
    const isAnonymous = !user;

    // Validate prescription file
    if (!formData.prescriptionFile) {
      return {
        success: false,
        error: 'Prescription file is required',
      };
    }

    // Validate required fields
    if (!formData.doctorName?.trim()) {
      return {
        success: false,
        error: 'Doctor name is required',
      };
    }

    if (!formData.prescriptionDate) {
      return {
        success: false,
        error: 'Prescription date is required',
      };
    }

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;

    // Step 1: Update user profile if logged in AND medical aid info provided
    if (user && formData.paymentType === 'medical-aid' && formData.medicalAidProvider) {
      await supabase
        .from('profiles')
        .update({
          medical_aid_provider: formData.medicalAidProvider,
          medical_aid_number: formData.medicalAidNumber,
          phone: formData.whatsappNumber,
          id_number: formData.idNumber,
          date_of_birth: formData.dateOfBirth || null,
        })
        .eq('id', user.id);
    }

    // Step 2: Create/Update delivery address if delivery method
    let deliveryAddressId: string | null = null;
    if (formData.deliveryMethod === 'delivery') {
      const addressData: any = {
        label: 'Home',
        recipient_name: fullName,
        recipient_phone: formData.whatsappNumber,
        street_address: formData.streetAddress,
        suburb: formData.addressLine2 || null,
        city: formData.city,
        province: formData.province,
        postal_code: formData.postalCode,
        is_default: true,
      };

      // Add user_id only if logged in
      if (user) {
        addressData.user_id = user.id;
      }

      const { data: addressRecord, error: addressError } = await supabase
        .from('delivery_addresses')
        .insert(addressData)
        .select()
        .single();

      if (addressError) {
        console.error('Address creation error:', addressError);
        // Continue anyway - address isn't critical for submission
      } else {
        deliveryAddressId = addressRecord.id;
      }
    }

    // Step 3: Create prescription record (WITH OR WITHOUT user_id)
    const prescriptionData: any = {
      // User & Contact
      user_id: user?.id || null,
      is_anonymous: isAnonymous,
      contact_email: email || formData.email || null,
      
      // Patient Info
      patient_name: fullName,
      patient_id_number: formData.idNumber || null,
      patient_phone: formData.whatsappNumber,
      
      // Doctor Info (NEW - now properly mapped)
      doctor_name: formData.doctorName.trim(),
      doctor_practice_number: formData.doctorPracticeNumber?.trim() || null,
      
      // Prescription Details (NEW - now properly mapped)
      prescription_date: formData.prescriptionDate,
      is_chronic: formData.isChronic,
      chronic_repeats_remaining: formData.isChronic 
        ? parseInt(formData.chronicRepeats) || 0 
        : null,
      
      // Pharmacy (FIXED - now uses UUID directly)
      preferred_pharmacy_id: formData.preferredPharmacyId || null,
      collection_pharmacy_id: formData.deliveryMethod === 'collection' 
        ? formData.preferredPharmacyId 
        : null,
      
      // Delivery
      delivery_method: formData.deliveryMethod,
      delivery_address_id: deliveryAddressId,
      
      // Instructions
      special_instructions: buildSpecialInstructions(formData),
      
      // Payment
      medical_aid_claim: formData.paymentType === 'medical-aid',
      payment_status: mapPaymentType(formData.paymentType),
      
      // Status
      status: 'submitted',
    };

    // Use server action with service role to bypass RLS on prescriptions table
    const prescriptionResult = await createPrescriptionRecord(prescriptionData);

    if ('error' in prescriptionResult) {
      return {
        success: false,
        error: `Failed to create prescription: ${prescriptionResult.error}`,
      };
    }

    const prescriptionRecord = prescriptionResult;

    // Step 4: Upload prescription image
    // For anonymous users, use prescription ID as temporary user ID
    const uploadUserId = user?.id || `anonymous-${prescriptionRecord.id}`;
    
    const uploadResult = await uploadPrescriptionImage({
      file: formData.prescriptionFile,
      prescriptionId: prescriptionRecord.id,
      userId: uploadUserId,
    });

    if (!uploadResult.success) {
      // Rollback prescription if image upload fails (service role bypasses RLS)
      await deletePrescriptionRecord(prescriptionRecord.id);

      return {
        success: false,
        error: uploadResult.error || 'Failed to upload prescription image',
      };
    }

    // Step 5: Create notification ONLY if user is logged in
    if (user) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        prescription_id: prescriptionRecord.id,
        type: 'status_update',
        title: 'Prescription Submitted',
        message: `Your prescription ${prescriptionRecord.prescription_number} has been submitted successfully. Our pharmacist will review it shortly.`,
      });

      // Step 6: Award prescription points
      const points = formData.isChronic ? 50 : 25;
      await supabase.from('rewards_transactions').insert({
        user_id: user.id,
        points,
        type: 'prescription',
        description: formData.isChronic ? 'Chronic prescription submitted' : 'Prescription submitted',
        reference: prescriptionRecord.id,
      });

      const { data: currentRewards } = await supabase
        .from('rewards')
        .select('points')
        .eq('user_id', user.id)
        .single();

      const newTotal = (currentRewards?.points ?? 0) + points;
      await supabase.from('rewards').upsert({
        user_id: user.id,
        points: newTotal,
        tier: calculateTier(newTotal),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });
    }

    return {
      success: true,
      prescriptionId: prescriptionRecord.id,
      prescriptionNumber: prescriptionRecord.prescription_number,
    };
  } catch (error) {
    console.error('Unexpected error during submission:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

/**
 * Match anonymous prescriptions to user account when they sign up
 * Called automatically during signup process
 */
export async function matchAnonymousPrescriptions(
  userId: string, 
  phone: string, 
  email?: string
): Promise<{ success: boolean; count: number }> {
  try {
    // Build query to find matching anonymous prescriptions
    let query = supabase
      .from('prescriptions')
      .update({ 
        user_id: userId,
        is_anonymous: false,
      })
      .is('user_id', null);

    // Match by phone OR email
    if (email) {
      query = query.or(`patient_phone.eq.${phone},contact_email.eq.${email}`);
    } else {
      query = query.eq('patient_phone', phone);
    }

    const { data: matchedPrescriptions, error } = await query.select();

    if (error) {
      console.error('Error matching prescriptions:', error);
      return { success: false, count: 0 };
    }

    const count = matchedPrescriptions?.length || 0;
    
    return { 
      success: true, 
      count 
    };
  } catch (error) {
    console.error('Unexpected error matching prescriptions:', error);
    return { success: false, count: 0 };
  }
}

/**
 * Get user's prescriptions (including matched ones)
 */
export async function getUserPrescriptions(userId: string) {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        prescription_items (*),
        delivery_addresses (*),
        pharmacies (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching prescriptions:', error);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}

/**
 * Get prescription by ID
 */
export async function getPrescriptionById(prescriptionId: string, userId: string) {
  try {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        prescription_items (*),
        prescription_images (*),
        delivery_addresses (*),
        pharmacies (*)
      `)
      .eq('id', prescriptionId)
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching prescription:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}