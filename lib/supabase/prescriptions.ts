import { supabase } from './client';
import { uploadPrescriptionImage } from './storage';

interface PrescriptionFormData {
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  idNumber: string;
  dateOfBirth: string;
  preferredContact: string;
  prescriptionFile: File | null;
  deliveryMethod: 'collection' | 'delivery';
  collectionStore: string;
  streetAddress: string;
  addressLine2: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  additionalNotes: string;
  paymentType: string;
  medicalAidProvider: string;
  medicalAidNumber: string;
  dependantCode: string;
  replaceWithGenerics: boolean;
  hasAllergies: boolean;
  allergyDetails: string;
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
function buildSpecialInstructions(formData: PrescriptionFormData, collectionStoreName?: string): string {
  const instructions = [
    formData.additionalNotes,
    formData.replaceWithGenerics ? 'Replace with generics where possible' : 'Do not replace with generics',
    formData.hasAllergies ? `ALLERGIES: ${formData.allergyDetails}` : null,
    formData.dependantCode ? `Medical Aid Dependant: ${formData.dependantCode}` : null,
    `Preferred contact method: ${formData.preferredContact}`,
    collectionStoreName ? `Collection Store: ${collectionStoreName}` : null,
  ].filter(Boolean);

  return instructions.join(' | ');
}

/**
 * Get pharmacy ID from database by name
 * Returns null if pharmacies table doesn't exist or store not found
 */
async function getPharmacyId(storeName: string): Promise<string | null> {
  try {
    // Extract just the pharmacy name (before the " - " separator)
    // e.g., "Sparkport Overport - 382 Corner..." -> "Sparkport Overport"
    const pharmacyName = storeName.split(' - ')[0].trim();
    
    const { data, error } = await supabase
      .from('pharmacies')
      .select('id')
      .eq('is_active', true)
      .ilike('name', `%${pharmacyName}%`)
      .single();

    if (error) {
      // Table doesn't exist or query failed - this is OK, we'll save store name in special_instructions
      console.warn('Pharmacy lookup skipped:', error.message);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.warn('Pharmacy lookup failed:', error);
    return null;
  }
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

    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    const today = new Date().toISOString().split('T')[0];

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

    // Step 3: Get pharmacy ID if collection method
    let pharmacyId: string | null = null;
    let collectionStoreName: string | null = null;
    if (formData.deliveryMethod === 'collection' && formData.collectionStore) {
      collectionStoreName = formData.collectionStore;
      pharmacyId = await getPharmacyId(formData.collectionStore);
      if (!pharmacyId) {
        console.log('Pharmacy ID not found, will save store name in special_instructions');
      }
    }

    // Step 4: Create prescription record (WITH OR WITHOUT user_id)
    const prescriptionData: any = {
      user_id: user?.id || null, // NULL for anonymous submissions
      is_anonymous: isAnonymous,
      contact_email: email || null, // For matching when user signs up
      patient_name: fullName,
      patient_id_number: formData.idNumber || null,
      patient_phone: formData.whatsappNumber,
      doctor_name: 'Not provided',
      doctor_practice_number: null,
      prescription_date: today,
      is_chronic: false,
      delivery_method: formData.deliveryMethod,
      collection_pharmacy_id: pharmacyId,
      delivery_address_id: deliveryAddressId,
      special_instructions: buildSpecialInstructions(formData, collectionStoreName || undefined),
      medical_aid_claim: formData.paymentType === 'medical-aid',
      payment_status: mapPaymentType(formData.paymentType),
    };

    const { data: prescriptionRecord, error: prescriptionError } = await supabase
      .from('prescriptions')
      .insert(prescriptionData)
      .select()
      .single();

    if (prescriptionError) {
      console.error('Prescription creation error:', prescriptionError);
      console.error('Error details:', JSON.stringify(prescriptionError, null, 2));
      console.error('Error message:', prescriptionError.message);
      console.error('Error code:', prescriptionError.code);
      return {
        success: false,
        error: `Failed to create prescription: ${prescriptionError.message || 'Unknown error'}`,
      };
    }

    // Step 5: Upload prescription image
    // For anonymous users, use prescription ID as temporary user ID
    const uploadUserId = user?.id || `anonymous-${prescriptionRecord.id}`;
    
    const uploadResult = await uploadPrescriptionImage({
      file: formData.prescriptionFile,
      prescriptionId: prescriptionRecord.id,
      userId: uploadUserId,
    });

    if (!uploadResult.success) {
      // Rollback prescription if image upload fails
      await supabase
        .from('prescriptions')
        .delete()
        .eq('id', prescriptionRecord.id);

      return {
        success: false,
        error: uploadResult.error || 'Failed to upload prescription image',
      };
    }

    // Step 6: Create notification ONLY if user is logged in
    if (user) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        prescription_id: prescriptionRecord.id,
        type: 'status_update',
        title: 'Prescription Submitted',
        message: `Your prescription ${prescriptionRecord.prescription_number} has been submitted successfully. Our pharmacist will review it shortly.`,
      });
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
    
    if (count > 0) {
      console.log(`✅ Matched ${count} prescription(s) to user ${userId}`);
    }

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