'use server';

import { FILE_UPLOAD_KIND, STORAGE_BUCKETS } from '@/constants/file-upload';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function deleteOrderPhoto(path: string): Promise<void> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return;
  }

  if (!path.startsWith(`${consumer.id}/${FILE_UPLOAD_KIND.PHOTO}/`)) {
    return;
  }

  await createServiceRoleClient().storage.from(STORAGE_BUCKETS.ORDER_UPLOADS).remove([path]);
}
