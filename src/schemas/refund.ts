import { z } from 'zod';

import { REFUND_NOTE_MAX_LENGTH } from '@/constants/refund';

// Admin-initiated refund. `amount` omitted means a full refund of the order's
// outstanding amount; `note` is an optional internal memo.
export const adminRefundInputSchema = z.object({
  amount: z.number().int().positive().optional(),
  note: z.string().trim().max(REFUND_NOTE_MAX_LENGTH).optional(),
});

export type AdminRefundInput = z.infer<typeof adminRefundInputSchema>;
