import { supabase } from './client';

interface UploadPrescriptionImageParams {
  file: File;
  prescriptionId: string;
  userId: string;
}

interface UploadResult {
  success: boolean;
  path?: string;
  error?: string;
}

/**
 * Upload prescription image to Supabase Storage
 */
export async function uploadPrescriptionImage({
  file,
  prescriptionId,
  userId,
}: UploadPrescriptionImageParams): Promise<UploadResult> {
  try {
    // Validate file size (12MB max to match form validation)
    const MAX_FILE_SIZE = 12 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: 'File size exceeds 12MB limit',
      };
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Only JPG, PNG, WEBP, and PDF are allowed',
      };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExt = file.name.split('.').pop();
    const fileName = `${prescriptionId}-${timestamp}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('prescription-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Save to prescription_images table
    const { error: dbError } = await supabase
      .from('prescription_images')
      .insert({
        prescription_id: prescriptionId,
        storage_path: data.path,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
      });

    if (dbError) {
      console.error('Database error:', dbError);
      // Clean up uploaded file
      await supabase.storage.from('prescription-images').remove([data.path]);
      return {
        success: false,
        error: 'Failed to save image record',
      };
    }

    return {
      success: true,
      path: data.path,
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}

/**
 * Get signed URL for prescription image (valid for 1 hour)
 */
export async function getPrescriptionImageUrl(path: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('prescription-images')
      .createSignedUrl(path, 3600); // 1 hour

    if (error) {
      console.error('Error creating signed URL:', error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
}

/**
 * Delete prescription image
 */
export async function deletePrescriptionImage(path: string): Promise<boolean> {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from('prescription-images')
      .remove([path]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
      return false;
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('prescription_images')
      .delete()
      .eq('storage_path', path);

    if (dbError) {
      console.error('Database delete error:', dbError);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    return false;
  }
}

/**
 * Get all images for a prescription
 */
export async function getPrescriptionImages(prescriptionId: string) {
  try {
    const { data, error } = await supabase
      .from('prescription_images')
      .select('*')
      .eq('prescription_id', prescriptionId)
      .order('uploaded_at', { ascending: true });

    if (error) {
      console.error('Error fetching images:', error);
      return [];
    }

    // Get signed URLs for all images
    const imagesWithUrls = await Promise.all(
      data.map(async (image) => {
        const url = await getPrescriptionImageUrl(image.storage_path);
        return {
          ...image,
          url,
        };
      })
    );

    return imagesWithUrls;
  } catch (error) {
    console.error('Unexpected error:', error);
    return [];
  }
}