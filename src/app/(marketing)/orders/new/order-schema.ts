import { z } from 'zod';

import { COUPON_CODE_MAX_LENGTH } from '@/constants/coupon';
import { PHOTOBOOK_PHOTOS_PER_PAGE, isPhotobookPageCount } from '@/constants/photobook';

export const orderDetailsSchema = z.object({
  productId: z.string().min(1),
  title: z.string().min(1).max(200),
  quantity: z.number().int().positive(),
  pageCount: z.number().int().refine(isPhotobookPageCount),
  couponCode: z.string().max(COUPON_CODE_MAX_LENGTH).optional(),
});

export type OrderDetailsInput = z.infer<typeof orderDetailsSchema>;

export const createConsumerOrderSchema = orderDetailsSchema
  .extend({
    photoPaths: z.array(z.string().min(1)),
  })
  .refine((data) => data.photoPaths.length === data.pageCount * PHOTOBOOK_PHOTOS_PER_PAGE, {
    path: ['photoPaths'],
  });

export type CreateConsumerOrderInput = z.infer<typeof createConsumerOrderSchema>;
