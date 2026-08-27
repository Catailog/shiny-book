import 'server-only';

import { FILE_UPLOAD_KIND, STORAGE_BUCKETS } from '@/constants/file-upload';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

type ServiceRoleClient = ReturnType<typeof createServiceRoleClient>;

async function deleteConsumerStorageFiles(
  supabase: ServiceRoleClient,
  consumerId: string,
): Promise<void> {
  const folders = [FILE_UPLOAD_KIND.PHOTO, FILE_UPLOAD_KIND.AVATAR];
  const paths: string[] = [];

  for (const folder of folders) {
    const { data } = await supabase.storage
      .from(STORAGE_BUCKETS.ORDER_UPLOADS)
      .list(`${consumerId}/${folder}`, { limit: 1000 });

    for (const file of data ?? []) {
      paths.push(`${consumerId}/${folder}/${file.name}`);
    }
  }

  if (paths.length > 0) {
    await supabase.storage.from(STORAGE_BUCKETS.ORDER_UPLOADS).remove(paths);
  }
}

// Orders, inquiries, and reviews are kept (not deleted) and merely unlinked from the
// consumer - Korean e-commerce law (전자상거래법 시행령) requires retaining payment/supply
// records for 5 years and dispute-related records for 3 years regardless of account
// deletion. The consumer_id FK on those tables is ON DELETE SET NULL, so deleting the
// auth user unlinks them atomically as part of the same Postgres delete - there is no
// separate application-level update step to fail halfway through. Order photos (no
// independent retention need) and the consumer's own storage files are removed
// afterward on a best-effort basis: once the account itself is gone the deletion has
// succeeded from the user's perspective, and leftover files are cleaned up the same way
// as other orphaned uploads.
export async function deleteConsumerAndData(consumerId: string): Promise<boolean> {
  const supabase = createServiceRoleClient();

  const { data: orders } = await supabase.from('orders').select('id').eq('consumer_id', consumerId);
  const orderIds = (orders ?? []).map((order) => order.id);

  const { error: userError } = await supabase.auth.admin.deleteUser(consumerId);
  if (userError) {
    return false;
  }

  if (orderIds.length > 0) {
    await supabase.from('order_photos').delete().in('order_id', orderIds);
  }
  await deleteConsumerStorageFiles(supabase, consumerId);

  return true;
}
