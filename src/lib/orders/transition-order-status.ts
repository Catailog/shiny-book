import 'server-only';

import { ORDER_EVENT_TYPE, type OrderEventSource } from '@/constants/order-event';
import type { OrderStatus } from '@/constants/order-status';
import type { Tables } from '@/lib/db/database.types';
import { canTransition } from '@/lib/orders/order-state-machine';
import { recordOrderEvent } from '@/lib/orders/record-order-event';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface OrderStatusChangeEvent {
  source: OrderEventSource;
  actor?: string;
  reason?: string;
  metadata?: unknown;
}

export async function transitionOrderStatus(
  orderId: string,
  from: OrderStatus,
  to: OrderStatus,
  event: OrderStatusChangeEvent,
): Promise<Tables<'orders'> | null> {
  if (!canTransition(from, to)) {
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
