import { z } from 'zod';

import { COUPON_CODE_MAX_LENGTH, COUPON_PERCENTAGE_MAX, DISCOUNT_TYPE } from '@/constants/coupon';

export const couponFormSchema = z
  .object({
    code: z.string().min(1).max(COUPON_CODE_MAX_LENGTH),
    discountType: z.enum([DISCOUNT_TYPE.FIXED, DISCOUNT_TYPE.PERCENTAGE]),
    discountValue: z.coerce.number().int().positive(),
    maxUses: z.string().optional(),
    expiresAt: z.string().optional(),
  })
  .refine(
    (data) =>
      data.discountType !== DISCOUNT_TYPE.PERCENTAGE || data.discountValue <= COUPON_PERCENTAGE_MAX,
    { path: ['discountValue'] },
  );

export type CouponFormInput = z.infer<typeof couponFormSchema>;

export const createCouponSchema = z
  .object({
    code: z.string().min(1).max(COUPON_CODE_MAX_LENGTH),
    discountType: z.enum([DISCOUNT_TYPE.FIXED, DISCOUNT_TYPE.PERCENTAGE]),
    discountValue: z.number().int().positive(),
    maxUses: z.number().int().positive().optional(),
    expiresAt: z.string().optional(),
  })
  .refine(
    (data) =>
      data.discountType !== DISCOUNT_TYPE.PERCENTAGE || data.discountValue <= COUPON_PERCENTAGE_MAX,
    { path: ['discountValue'] },
  );

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
