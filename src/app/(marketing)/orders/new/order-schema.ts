import { z } from 'zod';

import { COUPON_CODE_MAX_LENGTH } from '@/constants/coupon';
import {
  ORDER_QUANTITY_MAX,
  ORDER_TITLE_ALLOWED_CHARS_REGEX,
  ORDER_TITLE_MAX_LENGTH,
} from '@/constants/order';
import { PHOTOBOOK_PHOTOS_PER_PAGE, isPhotobookPageCount } from '@/constants/photobook';

export const orderDetailsSchema = z.object({
  productId: z.string().uuid(),
  title: z.string().min(1).max(ORDER_TITLE_MAX_LENGTH).regex(ORDER_TITLE_ALLOWED_CHARS_REGEX),
  quantity: z.number().int().positive().max(ORDER_QUANTITY_MAX),
  pageCount: z.number().int().refine(isPhotobookPageCount),
  addressId: z.string().uuid(),
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
