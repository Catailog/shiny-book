import 'server-only';

import { ORDER_EVENT_SOURCE, ORDER_EVENT_TYPE } from '@/constants/order-event';
import { isOrderStatus } from '@/constants/order-status';
import { OPEN_REFUND_STATUSES, REFUND_STATUS, isRefundableOrderStatus } from '@/constants/refund';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { recordOrderEvent } from '@/lib/orders/record-order-event';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import type { RefundRequestInput } from '@/schemas/refund';

export type RequestRefundResult =
  | { outcome: 'created'; refundRequestId: string }
  | { outcome: 'order_not_found' }
  | { outcome: 'not_refundable' }
  | { outcome: 'already_open' }
  | { outcome: 'amount_exceeds_remaining'; remaining: number }
  | { outcome: 'failed' };

export async function requestRefund(
  orderId: string,
  consumerId: string,
  input: RefundRequestInput,
): Promise<RequestRefundResult> {
  const order = await getOrderById(orderId);
  if (!order || order.consumer_id !== consumerId) {
    return { outcome: 'order_not_found' };
  }

  if (!isOrderStatus(order.status) || !isRefundableOrderStatus(order.status)) {
    return { outcome: 'not_refundable' };
  }

  const remaining = order.amount - order.refunded_amount;
  if (remaining <= 0) {
    return { outcome: 'not_refundable' };
  }

  if (input.amount !== undefined && input.amount > remaining) {
    return { outcome: 'amount_exceeds_remaining', remaining };
  }

  const supabase = createServiceRoleClient();

  const { data: openRequests } = await supabase
    .from('refund_requests')
    .select('id')
    .eq('order_id', orderId)
    .in('status', [...OPEN_REFUND_STATUSES]);

  if (openRequests && openRequests.length > 0) {
    return { outcome: 'already_open' };
  }

  const { data: created, error } = await supabase
    .from('refund_requests')
    .insert({
      order_id: orderId,
      requested_by: consumerId,
      reason: input.reason,
      amount: input.amount ?? null,
      status: REFUND_STATUS.REQUESTED,
    })
    .select('id')
    .single();

  if (error || !created) {
    return { outcome: 'failed' };
  }

  await recordOrderEvent({
    orderId,
    eventType: ORDER_EVENT_TYPE.REFUND_REQUESTED,
    source: ORDER_EVENT_SOURCE.CONSUMER,
    actor: consumerId,
    metadata: {
      refundRequestId: created.id,
      ...(input.amount === undefined ? {} : { amount: input.amount }),
    },
  });

  return { outcome: 'created', refundRequestId: created.id };
}
