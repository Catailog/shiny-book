'use server';

import sharp from 'sharp';

import { COVER_PROCESSED_IMAGE, FILE_UPLOAD_KIND, STORAGE_BUCKETS } from '@/constants/file-upload';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { buildProcessedCoverPath } from '@/lib/uploads/build-upload-path';

interface ProcessCoverImageSuccess {
  success: true;
  path: string;
}

interface ProcessCoverImageFailure {
  success: false;
  errorCode: 'unauthorized' | 'not_found' | 'unexpected_error';
}

export type ProcessCoverImageResult = ProcessCoverImageSuccess | ProcessCoverImageFailure;

export async function processCoverImage(rawPath: string): Promise<ProcessCoverImageResult> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { success: false, errorCode: 'unauthorized' };
  }

  if (!rawPath.startsWith(`${consumer.id}/${FILE_UPLOAD_KIND.COVER}/`)) {
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
      .resize(COVER_PROCESSED_IMAGE.WIDTH, COVER_PROCESSED_IMAGE.HEIGHT, { fit: 'cover' })
      .webp({ quality: COVER_PROCESSED_IMAGE.WEBP_QUALITY })
      .toBuffer();

    const processedPath = buildProcessedCoverPath(rawPath);
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
