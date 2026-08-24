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

export async function deleteConsumerAndData(consumerId: string): Promise<boolean> {
  const supabase = createServiceRoleClient();

  const { data: orders } = await supabase.from('orders').select('id').eq('consumer_id', consumerId);
  const orderIds = (orders ?? []).map((order) => order.id);

  if (orderIds.length > 0) {
    const { error: photosError } = await supabase
      .from('order_photos')
      .delete()
      .in('order_id', orderIds);
    if (photosError) {
      return false;
    }
  }

  const { error: reviewsError } = await supabase
    .from('reviews')
    .delete()
    .eq('consumer_id', consumerId);
  if (reviewsError) {
    return false;
  }

  const { error: inquiriesError } = await supabase
    .from('inquiries')
    .delete()
    .eq('consumer_id', consumerId);
  if (inquiriesError) {
    return false;
  }

  const { error: ordersError } = await supabase
    .from('orders')
    .delete()
    .eq('consumer_id', consumerId);
  if (ordersError) {
    return false;
  }

  const { error: addressesError } = await supabase
    .from('addresses')
    .delete()
    .eq('consumer_id', consumerId);
  if (addressesError) {
    return false;
  }

  await deleteConsumerStorageFiles(supabase, consumerId);

  const { error: userError } = await supabase.auth.admin.deleteUser(consumerId);
  return !userError;
}
