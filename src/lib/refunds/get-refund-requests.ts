import 'server-only';

import { REFUND_STATUS, type RefundStatus, isRefundStatus } from '@/constants/refund';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface RefundRequestListItem {
  id: string;
  orderId: string;
  orderTitle: string | null;
  reason: string;
  requestedAmount: number | null;
  orderAmount: number | null;
  orderRefundedAmount: number | null;
  status: RefundStatus;
  reviewNote: string | null;
  createdAt: string;
}

export async function getRefundRequests(): Promise<RefundRequestListItem[]> {
  const supabase = createServiceRoleClient();
  const { data } = await supabase
    .from('refund_requests')
    .select(
      'id, order_id, reason, amount, status, review_note, created_at, orders(title, amount, refunded_amount)',
    )
    .order('created_at', { ascending: false });

  if (!data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    orderId: row.order_id,
    orderTitle: row.orders?.title ?? null,
    reason: row.reason,
    requestedAmount: row.amount,
    orderAmount: row.orders?.amount ?? null,
    orderRefundedAmount: row.orders?.refunded_amount ?? null,
    status: isRefundStatus(row.status) ? row.status : REFUND_STATUS.FAILED,
    reviewNote: row.review_note,
    createdAt: row.created_at,
  }));
}
