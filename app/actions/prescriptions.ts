'use server';

import { createClient } from '@supabase/supabase-js';

const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface PrescriptionInsertData {
  user_id: string | null;
  is_anonymous: boolean;
  contact_email: string | null;
  patient_name: string;
  patient_id_number: string | null;
  patient_phone: string;
  doctor_name: string;
  doctor_practice_number: string | null;
  prescription_date: string;
  is_chronic: boolean;
  chronic_repeats_remaining: number | null;
  preferred_pharmacy_id: string | null;
  collection_pharmacy_id: string | null;
  delivery_method: string;
  delivery_address_id: string | null;
  special_instructions: string;
  medical_aid_claim: boolean;
  payment_status: string;
  status: string;
}

interface PrescriptionImageData {
  prescription_id: string;
  storage_path: string;
  file_name: string;
  file_size: number;
  mime_type: string;
}

export async function createPrescriptionImageRecord(
  data: PrescriptionImageData
): Promise<{ error?: string }> {
  const { error } = await adminClient.from('prescription_images').insert(data);

  if (error) {
    console.error('Prescription image insert error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return { error: error.message || 'Failed to save image record' };
  }

  return {};
}

export async function deletePrescriptionRecord(id: string): Promise<void> {
  await adminClient.from('prescriptions').delete().eq('id', id);
}

export async function createPrescriptionRecord(data: PrescriptionInsertData): Promise<
  { id: string; prescription_number: string } | { error: string }
> {
  const { data: record, error } = await adminClient
    .from('prescriptions')
    .insert(data)
    .select('id, prescription_number')
    .single();

  if (error) {
    console.error('Prescription insert error:', {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });
    return { error: error.message || error.code || 'Failed to create prescription' };
  }

  return { id: record.id, prescription_number: record.prescription_number };
}

export async function getUserPrescriptions(userId: string) {
  // Claim any anonymous prescriptions matching this user's email/phone first
  const { data: profile } = await adminClient
    .from('profiles')
    .select('email, phone')
    .eq('id', userId)
    .single();

  if (profile) {
    const orFilters: string[] = [];
    if (profile.email) orFilters.push(`contact_email.eq.${profile.email}`);
    if (profile.phone) orFilters.push(`patient_phone.eq.${profile.phone}`);
    if (orFilters.length > 0) {
      await adminClient
        .from('prescriptions')
        .update({ user_id: userId, is_anonymous: false })
        .is('user_id', null)
        .or(orFilters.join(','));
    }
  }

  const { data, error } = await adminClient
    .from('prescriptions')
    .select(`
      *,
      prescription_images (id, storage_path, file_name, file_size, mime_type, uploaded_at),
      delivery_addresses (street_address, suburb, city, province, postal_code)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getUserPrescriptions error:', error.message);
    return [];
  }

  return data ?? [];
}

export async function getPresignedImageUrl(storagePath: string): Promise<string | null> {
  const { data, error } = await adminClient.storage
    .from('prescription-images')
    .createSignedUrl(storagePath, 3600);

  if (error || !data) return null;
  return data.signedUrl;
}
