import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getOrderById(orderId: string): Promise<Tables<'orders'> | null> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from('orders').select().eq('id', orderId).maybeSingle();
  return data;
}
