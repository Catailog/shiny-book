'use server';

import sharp from 'sharp';

import {
  FILE_UPLOAD_KIND,
  ORDER_PHOTO_PROCESS_CONCURRENCY,
  PROCESSED_PHOTO_IMAGE,
  STORAGE_BUCKETS,
} from '@/constants/file-upload';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import {
  checkPhotoUploadRateLimit,
  retryAfterSeconds,
} from '@/lib/rate-limit/photo-upload-rate-limit';
import { runWithConcurrency } from '@/lib/run-with-concurrency';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { buildProcessedPhotoPath } from '@/lib/uploads/build-upload-path';

type ServiceRoleClient = ReturnType<typeof createServiceRoleClient>;

export interface ProcessedOrderPhoto {
  rawPath: string;
  // The processed webp path, or null if this one photo failed.
  processedPath: string | null;
}

interface ProcessOrderPhotosSuccess {
  success: true;
  results: ProcessedOrderPhoto[];
}

interface ProcessOrderPhotosFailure {
  success: false;
  errorCode: 'unauthorized' | 'rate_limited' | 'unexpected_error';
  // Only set for 'rate_limited': whole seconds until the caller may retry.
  retryAfterSeconds?: number;
}

export type ProcessOrderPhotosResult = ProcessOrderPhotosSuccess | ProcessOrderPhotosFailure;

async function processOne(
  supabase: ServiceRoleClient,
  rawPath: string,
): Promise<ProcessedOrderPhoto> {
  try {
    const { data: original, error: downloadError } = await supabase.storage
      .from(STORAGE_BUCKETS.ORDER_UPLOADS)
      .download(rawPath);

    if (downloadError || !original) {
      return { rawPath, processedPath: null };
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
      return { rawPath, processedPath: null };
    }

    await supabase.storage.from(STORAGE_BUCKETS.ORDER_UPLOADS).remove([rawPath]);

    return { rawPath, processedPath };
  } catch {
    return { rawPath, processedPath: null };
  }
}

// Processes a batch of already-uploaded raw photos in one Server Action call. Each photo
// is handled independently, so a single bad file does not fail the rest - the caller
// gets a per-path result and marks only the failed ones. Call it in modest chunks from
// the client so progress stays visible and no single request runs too long.
export async function processOrderPhotos(rawPaths: string[]): Promise<ProcessOrderPhotosResult> {
  try {
    const consumer = await getCurrentConsumer();
    if (!consumer) {
      return { success: false, errorCode: 'unauthorized' };
    }

    const ownPrefix = `${consumer.id}/${FILE_UPLOAD_KIND.PHOTO}/`;
    if (rawPaths.some((rawPath) => !rawPath.startsWith(ownPrefix))) {
      return { success: false, errorCode: 'unauthorized' };
    }

    const rateLimit = await checkPhotoUploadRateLimit(`photo-upload:${consumer.id}`);
    if (!rateLimit.isAllowed) {
      return {
        success: false,
        errorCode: 'rate_limited',
        retryAfterSeconds: retryAfterSeconds(rateLimit.resetAt),
      };
    }

    const supabase = createServiceRoleClient();
    const results: ProcessedOrderPhoto[] = [];
    await runWithConcurrency(rawPaths, ORDER_PHOTO_PROCESS_CONCURRENCY, async (rawPath, index) => {
      results[index] = await processOne(supabase, rawPath);
    });

    return { success: true, results };
  } catch {
    return { success: false, errorCode: 'unexpected_error' };
  }
}
