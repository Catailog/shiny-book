'use server';

import { revalidatePath } from 'next/cache';

import { ORDER_STATUS, type OrderStatus } from '@/constants/order-status';
import { ADMIN_ROUTES } from '@/constants/routes';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { canTransition } from '@/lib/orders/order-state-machine';
import { transitionOrderStatus } from '@/lib/orders/transition-order-status';

export interface AdvanceOrderStatusState {
  error: 'unauthorized' | 'not_allowed' | 'conflict' | null;
}

export async function advanceOrderStatus(
  orderId: string,
  from: OrderStatus,
  to: OrderStatus,
): Promise<AdvanceOrderStatusState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: 'unauthorized' };
  }

  if (from === ORDER_STATUS.AWAITING_PAYMENT || !canTransition(from, to)) {
    return { error: 'not_allowed' };
  }

  const updated = await transitionOrderStatus(orderId, from, to);
  if (!updated) {
    return { error: 'conflict' };
  }

  revalidatePath(ADMIN_ROUTES.DASHBOARD);
  return { error: null };
}
