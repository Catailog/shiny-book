'use server';

import { SIGNED_FILE_URL_EXPIRY_SECONDS, STORAGE_BUCKETS } from '@/constants/file-upload';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

interface GetSignedFileUrlSuccess {
  success: true;
  url: string;
}

interface GetSignedFileUrlFailure {
  success: false;
  errorCode: 'unauthorized' | 'not_found';
}

export type GetSignedFileUrlResult = GetSignedFileUrlSuccess | GetSignedFileUrlFailure;

export async function getSignedFileUrl(path: string): Promise<GetSignedFileUrlResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, errorCode: 'unauthorized' };
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.ORDER_UPLOADS)
    .createSignedUrl(path, SIGNED_FILE_URL_EXPIRY_SECONDS);

  if (error || !data) {
    return { success: false, errorCode: 'not_found' };
  }

  return { success: true, url: data.signedUrl };
}
