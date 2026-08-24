import 'server-only';

import { SIGNED_FILE_URL_EXPIRY_SECONDS, STORAGE_BUCKETS } from '@/constants/file-upload';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getSignedOrderPhotoUrl(path: string): Promise<string | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.storage
    .from(STORAGE_BUCKETS.ORDER_UPLOADS)
    .createSignedUrl(path, SIGNED_FILE_URL_EXPIRY_SECONDS);

  return data?.signedUrl ?? null;
}
