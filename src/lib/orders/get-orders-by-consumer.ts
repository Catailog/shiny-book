import 'server-only';

import { CONSUMER_ORDER_LIST_LIMIT } from '@/constants/consumer';
import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getOrdersByConsumer(consumerId: string): Promise<Tables<'orders'>[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('orders')
    .select()
    .eq('consumer_id', consumerId)
    .order('created_at', { ascending: false })
    .limit(CONSUMER_ORDER_LIST_LIMIT);

  return data ?? [];
}
