import 'server-only';

import { ORDER_STATUS, isOrderStatus } from '@/constants/order-status';
import type { Tables } from '@/lib/db/database.types';
import { canTransition } from '@/lib/orders/order-state-machine';
import { transitionOrderStatus } from '@/lib/orders/transition-order-status';
import { confirmTossPayment } from '@/lib/payments/toss-confirm-payment';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export type FinalizeOrderPaymentResult =
  | { outcome: 'confirmed'; order: Tables<'orders'> }
  | { outcome: 'already_processed'; order: Tables<'orders'> }
  | { outcome: 'amount_mismatch' }
  | { outcome: 'confirm_failed'; errorMessage: string }
  | { outcome: 'not_found' };

export async function finalizeOrderPayment(
  orderId: string,
  paymentKey: string,
  reportedAmount?: number,
): Promise<FinalizeOrderPaymentResult> {
  const supabase = createServiceRoleClient();

  const { data: order } = await supabase.from('orders').select().eq('id', orderId).maybeSingle();
  if (!order || !isOrderStatus(order.status)) {
    return { outcome: 'not_found' };
  }

  if (!canTransition(order.status, ORDER_STATUS.PAID)) {
    return { outcome: 'already_processed', order };
  }

  if (reportedAmount !== undefined && order.amount !== reportedAmount) {
    return { outcome: 'amount_mismatch' };
  }

  const confirmResult = await confirmTossPayment({
    paymentKey,
    orderId,
    amount: order.amount,
  });

  if (!confirmResult.isConfirmed) {
    return { outcome: 'confirm_failed', errorMessage: confirmResult.errorMessage };
  }

  const updated = await transitionOrderStatus(
    orderId,
    ORDER_STATUS.AWAITING_PAYMENT,
    ORDER_STATUS.PAID,
  );

  if (updated) {
    return { outcome: 'confirmed', order: updated };
  }

  const { data: latest } = await supabase.from('orders').select().eq('id', orderId).maybeSingle();
  if (latest) {
    return { outcome: 'already_processed', order: latest };
  }

  return { outcome: 'not_found' };
}
