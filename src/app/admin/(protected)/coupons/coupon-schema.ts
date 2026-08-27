import { z } from 'zod';

import {
  COUPON_CODE_MAX_LENGTH,
  COUPON_DISCOUNT_VALUE_MAX,
  COUPON_MAX_USES_MAX,
  COUPON_PERCENTAGE_MAX,
  DISCOUNT_TYPE,
} from '@/constants/coupon';

export const couponFormSchema = z
  .object({
    code: z.string().min(1).max(COUPON_CODE_MAX_LENGTH),
    discountType: z.enum([DISCOUNT_TYPE.FIXED, DISCOUNT_TYPE.PERCENTAGE]),
    discountValue: z.coerce.number().int().positive().max(COUPON_DISCOUNT_VALUE_MAX),
    maxUses: z.string().optional(),
    startsAt: z.string().optional(),
    expiresAt: z.string().optional(),
  })
  .refine(
    (data) =>
      data.discountType !== DISCOUNT_TYPE.PERCENTAGE || data.discountValue <= COUPON_PERCENTAGE_MAX,
    { path: ['discountValue'] },
  )
  .refine((data) => !data.startsAt || !data.expiresAt || data.startsAt <= data.expiresAt, {
    path: ['startsAt'],
  });

export type CouponFormInput = z.infer<typeof couponFormSchema>;

export const createCouponSchema = z
  .object({
    code: z.string().min(1).max(COUPON_CODE_MAX_LENGTH),
    discountType: z.enum([DISCOUNT_TYPE.FIXED, DISCOUNT_TYPE.PERCENTAGE]),
    discountValue: z.number().int().positive().max(COUPON_DISCOUNT_VALUE_MAX),
    maxUses: z.number().int().positive().max(COUPON_MAX_USES_MAX).optional(),
    startsAt: z.string().optional(),
    expiresAt: z.string().optional(),
  })
  .refine(
    (data) =>
      data.discountType !== DISCOUNT_TYPE.PERCENTAGE || data.discountValue <= COUPON_PERCENTAGE_MAX,
    { path: ['discountValue'] },
  )
  .refine((data) => !data.startsAt || !data.expiresAt || data.startsAt <= data.expiresAt, {
    path: ['startsAt'],
  });

export type CreateCouponInput = z.infer<typeof createCouponSchema>;
