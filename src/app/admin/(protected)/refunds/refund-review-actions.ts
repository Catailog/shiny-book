'use server';

import { revalidatePath } from 'next/cache';

import { ADMIN_ROUTES } from '@/constants/routes';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { processRefund } from '@/lib/refunds/process-refund';
import { type ReviewRefundResult, reviewRefund } from '@/lib/refunds/review-refund';
import { refundReviewInputSchema } from '@/schemas/refund';

export interface RefundReviewActionResult {
  errorCode?:
    | 'unauthorized'
    | 'validation_failed'
    | 'not_found'
    | 'not_pending'
    | 'process_failed'
    | 'failed';
}

function reviewErrorCode(
  outcome: Exclude<ReviewRefundResult['outcome'], 'approved' | 'rejected'>,
): RefundReviewActionResult['errorCode'] {
  return outcome;
}

export async function approveRefund(
  refundRequestId: string,
  input: { note?: string },
): Promise<RefundReviewActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = refundReviewInputSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const reviewed = await reviewRefund(refundRequestId, admin.id, 'approve', parsed.data);
  if (reviewed.outcome !== 'approved') {
    revalidatePath(ADMIN_ROUTES.REFUNDS);
    return {
      errorCode: reviewed.outcome === 'rejected' ? 'failed' : reviewErrorCode(reviewed.outcome),
    };
  }

  const processed = await processRefund(refundRequestId);
  revalidatePath(ADMIN_ROUTES.REFUNDS);

  return processed.outcome === 'completed' ? {} : { errorCode: 'process_failed' };
}

export async function rejectRefund(
  refundRequestId: string,
  input: { note?: string },
): Promise<RefundReviewActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = refundReviewInputSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const reviewed = await reviewRefund(refundRequestId, admin.id, 'reject', parsed.data);
  revalidatePath(ADMIN_ROUTES.REFUNDS);

  if (reviewed.outcome !== 'rejected') {
    return {
      errorCode: reviewed.outcome === 'approved' ? 'failed' : reviewErrorCode(reviewed.outcome),
    };
  }

  return {};
}

// Re-run processing for a request left in `failed` (or `approved`) after a
// previous attempt did not complete.
export async function retryRefund(refundRequestId: string): Promise<RefundReviewActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { errorCode: 'unauthorized' };
  }

  const processed = await processRefund(refundRequestId);
  revalidatePath(ADMIN_ROUTES.REFUNDS);

  if (processed.outcome === 'completed') {
    return {};
  }
  if (processed.outcome === 'not_found') {
    return { errorCode: 'not_found' };
  }
  if (processed.outcome === 'not_processable') {
    return { errorCode: 'not_pending' };
  }
  return { errorCode: 'process_failed' };
}
