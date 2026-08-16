import { z } from 'zod';

import { COUPON_CODE_MAX_LENGTH } from '@/constants/coupon';

export const orderDetailsSchema = z.object({
  title: z.string().min(1).max(200),
  quantity: z.number().int().positive(),
  couponCode: z.string().max(COUPON_CODE_MAX_LENGTH).optional(),
});

export type OrderDetailsInput = z.infer<typeof orderDetailsSchema>;

export const createConsumerOrderSchema = orderDetailsSchema.extend({
  manuscriptPath: z.string().min(1),
  coverPath: z.string().min(1),
});

export type CreateConsumerOrderInput = z.infer<typeof createConsumerOrderSchema>;
