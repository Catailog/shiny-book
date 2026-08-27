'use server';

import { STORAGE_BUCKETS } from '@/constants/file-upload';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { buildProductImagePath } from '@/lib/uploads/build-product-image-path';
import {
  type ProductImageSignedUploadUrlRequest,
  productImageSignedUploadUrlRequestSchema,
} from '@/schemas/product-image-upload';

interface CreateProductImageSignedUploadUrlSuccess {
  success: true;
  path: string;
  token: string;
  signedUrl: string;
  publicUrl: string;
}

interface CreateProductImageSignedUploadUrlFailure {
  success: false;
  errorCode: 'unauthorized' | 'validation_failed' | 'unexpected_error';
}

export type CreateProductImageSignedUploadUrlResult =
  CreateProductImageSignedUploadUrlSuccess | CreateProductImageSignedUploadUrlFailure;

export async function createProductImageSignedUploadUrl(
  input: ProductImageSignedUploadUrlRequest,
): Promise<CreateProductImageSignedUploadUrlResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, errorCode: 'unauthorized' };
  }

  const parsed = productImageSignedUploadUrlRequestSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, errorCode: 'validation_failed' };
  }

  const path = buildProductImagePath(parsed.data.fileType);
  const supabase = createServiceRoleClient();

  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKETS.PRODUCT_IMAGES)
      .createSignedUploadUrl(path);

    if (error || !data) {
      return { success: false, errorCode: 'unexpected_error' };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKETS.PRODUCT_IMAGES).getPublicUrl(data.path);

    return {
      success: true,
      path: data.path,
      token: data.token,
      signedUrl: data.signedUrl,
      publicUrl,
    };
  } catch {
    return { success: false, errorCode: 'unexpected_error' };
  }
}
