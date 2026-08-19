import 'server-only';

import { ORDER_STATUS } from '@/constants/order-status';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function getSoldBookCount(): Promise<number> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('orders')
    .select('quantity')
    .neq('status', ORDER_STATUS.AWAITING_PAYMENT);

  if (!data) {
    return 0;
  }

  return data.reduce((sum, order) => sum + order.quantity, 0);
}
