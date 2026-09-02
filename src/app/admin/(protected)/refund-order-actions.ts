'use server';

import { revalidatePath } from 'next/cache';

import { ADMIN_ROUTES } from '@/constants/routes';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { createRefund } from '@/lib/refunds/create-refund';
import { adminRefundInputSchema } from '@/schemas/refund';

export interface RefundOrderActionResult {
  errorCode?:
    | 'unauthorized'
    | 'validation_failed'
    | 'order_not_found'
    | 'not_refundable'
    | 'amount_exceeds_remaining'
    | 'process_failed'
    | 'failed';
}

export async function refundOrder(
  orderId: string,
  input: { amount?: number; note?: string },
): Promise<RefundOrderActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = adminRefundInputSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const result = await createRefund(orderId, admin.id, parsed.data);
  revalidatePath(ADMIN_ROUTES.DASHBOARD);
  revalidatePath(ADMIN_ROUTES.REFUNDS);

  return result.outcome === 'completed' ? {} : { errorCode: result.outcome };
}
