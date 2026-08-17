'use server';

import sharp from 'sharp';

import { FILE_UPLOAD_KIND, PROCESSED_PHOTO_IMAGE, STORAGE_BUCKETS } from '@/constants/file-upload';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { buildProcessedPhotoPath } from '@/lib/uploads/build-upload-path';

interface ProcessOrderPhotoSuccess {
  success: true;
  path: string;
}

interface ProcessOrderPhotoFailure {
  success: false;
  errorCode: 'unauthorized' | 'not_found' | 'unexpected_error';
}

export type ProcessOrderPhotoResult = ProcessOrderPhotoSuccess | ProcessOrderPhotoFailure;

export async function processOrderPhoto(rawPath: string): Promise<ProcessOrderPhotoResult> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { success: false, errorCode: 'unauthorized' };
  }

  if (!rawPath.startsWith(`${consumer.id}/${FILE_UPLOAD_KIND.PHOTO}/`)) {
    return { success: false, errorCode: 'unauthorized' };
  }

  const supabase = createServiceRoleClient();

  try {
    const { data: original, error: downloadError } = await supabase.storage
      .from(STORAGE_BUCKETS.ORDER_UPLOADS)
      .download(rawPath);

    if (downloadError || !original) {
      return { success: false, errorCode: 'not_found' };
    }

    const buffer = Buffer.from(await original.arrayBuffer());
    const processed = await sharp(buffer)
      .resize(PROCESSED_PHOTO_IMAGE.WIDTH, PROCESSED_PHOTO_IMAGE.HEIGHT, { fit: 'cover' })
      .webp({ quality: PROCESSED_PHOTO_IMAGE.WEBP_QUALITY })
      .toBuffer();

    const processedPath = buildProcessedPhotoPath(rawPath);
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKETS.ORDER_UPLOADS)
      .upload(processedPath, processed, { contentType: 'image/webp', upsert: true });

    if (uploadError) {
      return { success: false, errorCode: 'unexpected_error' };
    }

    await supabase.storage.from(STORAGE_BUCKETS.ORDER_UPLOADS).remove([rawPath]);

    return { success: true, path: processedPath };
  } catch {
    return { success: false, errorCode: 'unexpected_error' };
  }
}
