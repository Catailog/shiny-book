import 'server-only';

import { ORDER_EVENT_SOURCE, ORDER_EVENT_TYPE } from '@/constants/order-event';
import { ORDER_STATUS, isOrderStatus } from '@/constants/order-status';
import { REFUND_STATUS } from '@/constants/refund';
import { env } from '@/env';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { recordOrderEvent } from '@/lib/orders/record-order-event';
import { cancelTossPayment } from '@/lib/payments/toss-cancel-payment';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export type ProcessRefundResult =
  | { outcome: 'completed'; refundedAmount: number; fullyRefunded: boolean }
  | { outcome: 'not_found' }
  | { outcome: 'not_processable' }
  | { outcome: 'order_missing' }
  | { outcome: 'provider_failed'; errorMessage: string }
  | { outcome: 'failed' };

const PROCESSABLE_STATUSES: readonly string[] = [REFUND_STATUS.APPROVED, REFUND_STATUS.FAILED];

export async function processRefund(refundRequestId: string): Promise<ProcessRefundResult> {
  const supabase = createServiceRoleClient();

  const { data: request } = await supabase
    .from('refund_requests')
    .select('id, order_id, amount, reason, status')
    .eq('id', refundRequestId)
    .maybeSingle();

  if (!request) {
    return { outcome: 'not_found' };
  }

  if (!PROCESSABLE_STATUSES.includes(request.status)) {
    return { outcome: 'not_processable' };
  }

  const order = await getOrderById(request.order_id);
  if (!order || !isOrderStatus(order.status)) {
    return { outcome: 'order_missing' };
  }

  const remaining = order.amount - order.refunded_amount;
  const refundAmount = request.amount ?? remaining;

  if (refundAmount <= 0 || refundAmount > remaining) {
    await markRequestFailed(supabase, refundRequestId);
    return { outcome: 'failed' };
  }

  // A real cancellation needs the stored payment key. In the test-payment
  // environment `cancelTossPayment` mocks the call and ignores the key, so a
  // missing key (e.g. seeded orders) should not block the refund.
  if (order.payment_key === null && !env.ALLOW_TEST_PAYMENT) {
    await markRequestFailed(supabase, refundRequestId);
    return { outcome: 'provider_failed', errorMessage: 'Order has no stored payment key' };
  }

  const cancellation = await cancelTossPayment({
    paymentKey: order.payment_key ?? 'test-payment',
    cancelReason: request.reason,
    cancelAmount: request.amount ?? undefined,
  });

  if (!cancellation.isCancelled) {
    await markRequestFailed(supabase, refundRequestId);
    return { outcome: 'provider_failed', errorMessage: cancellation.errorMessage };
  }

  const nextRefundedAmount = order.refunded_amount + refundAmount;
  const fullyRefunded = nextRefundedAmount >= order.amount;

  const { data: updatedOrder } = await supabase
    .from('orders')
    .update({
      refunded_amount: nextRefundedAmount,
      ...(fullyRefunded ? { status: ORDER_STATUS.REFUNDED } : {}),
    })
    .eq('id', order.id)
    .eq('refunded_amount', order.refunded_amount)
    .select('id')
    .maybeSingle();

  if (!updatedOrder) {
    await markRequestFailed(supabase, refundRequestId);
    return { outcome: 'failed' };
  }

  await supabase
    .from('refund_requests')
    .update({
      status: REFUND_STATUS.COMPLETED,
      toss_transaction_key: cancellation.transactionKey,
    })
    .eq('id', refundRequestId);

  await recordOrderEvent({
    orderId: order.id,
    eventType: ORDER_EVENT_TYPE.REFUND_COMPLETED,
    source: ORDER_EVENT_SOURCE.SYSTEM,
    actor: 'system',
    metadata: {
      refundRequestId,
      amount: refundAmount,
      ...(cancellation.transactionKey === null
        ? {}
        : { transactionKey: cancellation.transactionKey }),
    },
  });

  if (fullyRefunded) {
    await recordOrderEvent({
      orderId: order.id,
      eventType: ORDER_EVENT_TYPE.ORDER_STATUS_CHANGED,
      source: ORDER_EVENT_SOURCE.SYSTEM,
      actor: 'system',
      fromStatus: order.status,
      toStatus: ORDER_STATUS.REFUNDED,
    });
  }

  return { outcome: 'completed', refundedAmount: refundAmount, fullyRefunded };
}

async function markRequestFailed(
  supabase: ReturnType<typeof createServiceRoleClient>,
  refundRequestId: string,
): Promise<void> {
  await supabase
    .from('refund_requests')
    .update({ status: REFUND_STATUS.FAILED })
    .eq('id', refundRequestId);
}
