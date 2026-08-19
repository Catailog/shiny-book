'use server';

import { STORAGE_BUCKETS } from '@/constants/file-upload';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';
import { buildUploadPath } from '@/lib/uploads/build-upload-path';
import { type SignedUploadUrlRequest, signedUploadUrlRequestSchema } from '@/schemas/file-upload';

interface CreateSignedUploadUrlSuccess {
  success: true;
  path: string;
  token: string;
  signedUrl: string;
}

interface CreateSignedUploadUrlFailure {
  success: false;
  errorCode: 'unauthorized' | 'validation_failed' | 'unexpected_error';
}

export type CreateSignedUploadUrlResult =
  CreateSignedUploadUrlSuccess | CreateSignedUploadUrlFailure;

export async function createSignedUploadUrl(
  input: SignedUploadUrlRequest,
): Promise<CreateSignedUploadUrlResult> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { success: false, errorCode: 'unauthorized' };
  }

  const parsed = signedUploadUrlRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, errorCode: 'validation_failed' };
  }

  const path = buildUploadPath(consumer.id, parsed.data.kind, parsed.data.fileName);
  const supabase = await createServerSupabaseClient();

  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.ORDER_UPLOADS)
      .createSignedUploadUrl(path);

    if (error || !data) {
      return { success: false, errorCode: 'unexpected_error' };
    }

    return { success: true, path: data.path, token: data.token, signedUrl: data.signedUrl };
  } catch {
    return { success: false, errorCode: 'unexpected_error' };
  }
}
