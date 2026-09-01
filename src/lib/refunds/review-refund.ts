import 'server-only';

import { ORDER_EVENT_SOURCE, ORDER_EVENT_TYPE } from '@/constants/order-event';
import { REFUND_STATUS } from '@/constants/refund';
import { recordOrderEvent } from '@/lib/orders/record-order-event';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import type { RefundReviewInput } from '@/schemas/refund';

export type ReviewRefundDecision = 'approve' | 'reject';

export type ReviewRefundResult =
  | { outcome: 'approved'; orderId: string }
  | { outcome: 'rejected'; orderId: string }
  | { outcome: 'not_found' }
  | { outcome: 'not_pending' }
  | { outcome: 'failed' };

export async function reviewRefund(
  refundRequestId: string,
  adminId: string,
  decision: ReviewRefundDecision,
  input: RefundReviewInput,
): Promise<ReviewRefundResult> {
  const supabase = createServiceRoleClient();

  const { data: request } = await supabase
    .from('refund_requests')
    .select('id, order_id, status')
    .eq('id', refundRequestId)
    .maybeSingle();

  if (!request) {
    return { outcome: 'not_found' };
  }

  if (request.status !== REFUND_STATUS.REQUESTED) {
    return { outcome: 'not_pending' };
  }

  const nextStatus = decision === 'approve' ? REFUND_STATUS.APPROVED : REFUND_STATUS.REJECTED;

  const { data: updated } = await supabase
    .from('refund_requests')
    .update({
      status: nextStatus,
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
      review_note: input.note ?? null,
    })
    .eq('id', refundRequestId)
    .eq('status', REFUND_STATUS.REQUESTED)
    .select('id')
    .maybeSingle();

  if (!updated) {
    return { outcome: 'failed' };
  }

  await recordOrderEvent({
    orderId: request.order_id,
    eventType:
      decision === 'approve' ? ORDER_EVENT_TYPE.REFUND_APPROVED : ORDER_EVENT_TYPE.REFUND_REJECTED,
    source: ORDER_EVENT_SOURCE.ADMIN,
    actor: adminId,
    metadata: { refundRequestId },
  });

  return decision === 'approve'
    ? { outcome: 'approved', orderId: request.order_id }
    : { outcome: 'rejected', orderId: request.order_id };
}
