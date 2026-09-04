'use server';

import { revalidatePath } from 'next/cache';

import { BULK_ACTION_CHUNK_SIZE, BULK_ACTION_MAX_ORDERS } from '@/constants/admin';
import { ORDER_EVENT_SOURCE } from '@/constants/order-event';
import { ORDER_STATUS, type OrderStatus } from '@/constants/order-status';
import { ADMIN_ROUTES } from '@/constants/routes';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { canRevert, canTransition } from '@/lib/orders/order-state-machine';
import { revertOrderStatus } from '@/lib/orders/revert-order-status';
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

  const updated = await transitionOrderStatus(orderId, from, to, {
    source: ORDER_EVENT_SOURCE.ADMIN,
    actor: admin.id,
  });
  if (!updated) {
    return { error: 'conflict' };
  }

  revalidatePath(ADMIN_ROUTES.DASHBOARD);
  return { error: null };
}

export interface RevertOrderStatusState {
  error: 'unauthorized' | 'not_allowed' | 'conflict' | null;
}

export async function revertOrderStatusAction(
  orderId: string,
  from: OrderStatus,
  to: OrderStatus,
): Promise<RevertOrderStatusState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: 'unauthorized' };
  }

  if (!canRevert(from, to)) {
    return { error: 'not_allowed' };
  }

  const updated = await revertOrderStatus(orderId, from, to, {
    source: ORDER_EVENT_SOURCE.ADMIN,
    actor: admin.id,
    reason: 'admin revert',
  });
  if (!updated) {
    return { error: 'conflict' };
  }

  revalidatePath(ADMIN_ROUTES.DASHBOARD);
  return { error: null };
}

export interface BulkAdvanceOrderStatusState {
  error: 'unauthorized' | 'not_allowed' | 'too_many' | null;
  succeededIds: string[];
  failedIds: string[];
}

export async function bulkAdvanceOrderStatus(
  orderIds: string[],
  from: OrderStatus,
  to: OrderStatus,
): Promise<BulkAdvanceOrderStatusState> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { error: 'unauthorized', succeededIds: [], failedIds: [] };
  }

  if (orderIds.length === 0 || from === ORDER_STATUS.AWAITING_PAYMENT || !canTransition(from, to)) {
    return { error: 'not_allowed', succeededIds: [], failedIds: [] };
  }

  if (orderIds.length > BULK_ACTION_MAX_ORDERS) {
    return { error: 'too_many', succeededIds: [], failedIds: [] };
  }

  const succeededIds: string[] = [];
  const failedIds: string[] = [];

  for (const chunk of chunkIds(orderIds, BULK_ACTION_CHUNK_SIZE)) {
    const results = await Promise.all(
      chunk.map((orderId) =>
        transitionOrderStatus(orderId, from, to, {
          source: ORDER_EVENT_SOURCE.ADMIN,
          actor: admin.id,
        }),
      ),
    );

    results.forEach((updated, index) => {
      const orderId = chunk[index];
      if (orderId === undefined) {
        return;
      }
      (updated ? succeededIds : failedIds).push(orderId);
    });
  }

  if (succeededIds.length > 0) {
    revalidatePath(ADMIN_ROUTES.DASHBOARD);
  }

  return { error: null, succeededIds, failedIds };
}

function chunkIds(ids: string[], size: number): string[][] {
  const chunks: string[][] = [];
  for (let index = 0; index < ids.length; index += size) {
    chunks.push(ids.slice(index, index + size));
  }
  return chunks;
}
