import 'server-only';

import { ORDER_EVENT_TYPE } from '@/constants/order-event';
import type { OrderStatus } from '@/constants/order-status';
import type { Tables } from '@/lib/db/database.types';
import { canRevert } from '@/lib/orders/order-state-machine';
import { recordOrderEvent } from '@/lib/orders/record-order-event';
import type { OrderStatusChangeEvent } from '@/lib/orders/transition-order-status';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export async function revertOrderStatus(
  orderId: string,
  from: OrderStatus,
  to: OrderStatus,
  event: OrderStatusChangeEvent,
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

  if (data) {
    await recordOrderEvent({
      orderId,
      eventType: ORDER_EVENT_TYPE.ORDER_STATUS_CHANGED,
      source: event.source,
      actor: event.actor,
      fromStatus: from,
      toStatus: to,
      reason: event.reason,
      metadata: event.metadata,
    });
  }

  return data;
}
