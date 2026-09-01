import { z } from 'zod';

import { REFUND_REASON_MAX_LENGTH, REFUND_REVIEW_NOTE_MAX_LENGTH } from '@/constants/refund';

export const refundRequestInputSchema = z.object({
  reason: z.string().trim().min(1).max(REFUND_REASON_MAX_LENGTH),
  // Omitted / undefined means a full refund of the order's outstanding amount.
  amount: z.number().int().positive().optional(),
});

export type RefundRequestInput = z.infer<typeof refundRequestInputSchema>;

export const refundReviewInputSchema = z.object({
  note: z.string().trim().max(REFUND_REVIEW_NOTE_MAX_LENGTH).optional(),
});

export type RefundReviewInput = z.infer<typeof refundReviewInputSchema>;
