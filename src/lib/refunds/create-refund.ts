import 'server-only';

import { isOrderStatus } from '@/constants/order-status';
import {
  ADMIN_INITIATED_REFUND_REASON,
  REFUND_STATUS,
  isRefundableOrderStatus,
} from '@/constants/refund';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { type ProcessRefundResult, processRefund } from '@/lib/refunds/process-refund';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import type { AdminRefundInput } from '@/schemas/refund';

export type CreateRefundResult =
  | { outcome: 'completed'; refundedAmount: number; fullyRefunded: boolean }
  | { outcome: 'order_not_found' }
  | { outcome: 'not_refundable' }
  | { outcome: 'amount_exceeds_remaining'; remaining: number }
  | { outcome: 'process_failed' }
  | { outcome: 'failed' };

// Admin-initiated refund: record the refund request as pre-approved, then
// process it (payment provider cancel + order update) in one step.
export async function createRefund(
  orderId: string,
  adminId: string,
  input: AdminRefundInput,
): Promise<CreateRefundResult> {
  const order = await getOrderById(orderId);
  if (!order) {
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

  const note = input.note?.trim() ? input.note.trim() : null;

  const supabase = createServiceRoleClient();
  const now = new Date().toISOString();

  const { data: created, error } = await supabase
    .from('refund_requests')
    .insert({
      order_id: orderId,
      requested_by: adminId,
      reviewed_by: adminId,
      reviewed_at: now,
      reason: note ?? ADMIN_INITIATED_REFUND_REASON,
      review_note: note,
      amount: input.amount ?? null,
      status: REFUND_STATUS.APPROVED,
    })
    .select('id')
    .single();

  if (error || !created) {
    return { outcome: 'failed' };
  }

  return mapProcessResult(await processRefund(created.id));
}

function mapProcessResult(result: ProcessRefundResult): CreateRefundResult {
  if (result.outcome === 'completed') {
    return {
      outcome: 'completed',
      refundedAmount: result.refundedAmount,
      fullyRefunded: result.fullyRefunded,
    };
  }
  return { outcome: 'process_failed' };
}
