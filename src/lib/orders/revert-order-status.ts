import 'server-only';

import type { OrderStatus } from '@/constants/order-status';
import type { Tables } from '@/lib/db/database.types';
import { canRevert } from '@/lib/orders/order-state-machine';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function revertOrderStatus(
  orderId: string,
  from: OrderStatus,
  to: OrderStatus,
): Promise<Tables<'orders'> | null> {
  if (!canRevert(from, to)) {
    return null;
  }

  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('orders')
    .update({ status: to })
    .eq('id', orderId)
    .eq('status', from)
    .select()
    .maybeSingle();

  return data;
}
