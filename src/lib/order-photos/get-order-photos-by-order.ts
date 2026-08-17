import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getOrderPhotosByOrder(orderId: string): Promise<Tables<'order_photos'>[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('order_photos')
    .select()
    .eq('order_id', orderId)
    .order('display_order', { ascending: true });

  return data ?? [];
}
