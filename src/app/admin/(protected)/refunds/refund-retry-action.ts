'use server';

import { revalidatePath } from 'next/cache';

import { ADMIN_ROUTES } from '@/constants/routes';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { processRefund } from '@/lib/refunds/process-refund';

export interface RetryRefundActionResult {
  errorCode?: 'unauthorized' | 'not_found' | 'not_processable' | 'process_failed';
}

// Re-run processing for a refund left in `failed` after a previous attempt.
export async function retryRefund(refundRequestId: string): Promise<RetryRefundActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const processed = await processRefund(refundRequestId);
  revalidatePath(ADMIN_ROUTES.REFUNDS);
  revalidatePath(ADMIN_ROUTES.DASHBOARD);

  if (processed.outcome === 'completed') {
    return {};
  }
  if (processed.outcome === 'not_found') {
    return { errorCode: 'not_found' };
  }
  if (processed.outcome === 'not_processable') {
    return { errorCode: 'not_processable' };
  }
  return { errorCode: 'process_failed' };
}
