import 'server-only';

import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getOrderEvents(orderId: string): Promise<Tables<'order_events'>[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('order_events')
    .select()
    .eq('order_id', orderId)
    .order('created_at', { ascending: true });

  return data ?? [];
}
