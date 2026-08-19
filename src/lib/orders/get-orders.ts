import 'server-only';

import { ADMIN_ORDER_LIST_LIMIT } from '@/constants/admin';
import type { Tables } from '@/lib/db/database.types';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getOrders(): Promise<Tables<'orders'>[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('orders')
    .select()
    .order('created_at', { ascending: false })
    .limit(ADMIN_ORDER_LIST_LIMIT);

  return data ?? [];
}
