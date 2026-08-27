import { z } from 'zod';

import {
  PRODUCT_DESCRIPTION_MAX_LENGTH,
  PRODUCT_NAME_MAX_LENGTH,
  PRODUCT_PRICE_MAX,
  PRODUCT_SIZE_MAX_LENGTH,
  PRODUCT_SLUG_MAX_LENGTH,
} from '@/constants/product';
import { PRODUCT_CATEGORY } from '@/constants/product-category';

export const productFormSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(PRODUCT_SLUG_MAX_LENGTH)
    .regex(/^[a-z0-9-]+$/),
  name: z.string().min(1).max(PRODUCT_NAME_MAX_LENGTH),
  nameEn: z.string().max(PRODUCT_NAME_MAX_LENGTH).optional(),
  size: z.string().min(1).max(PRODUCT_SIZE_MAX_LENGTH),
  description: z.string().min(1).max(PRODUCT_DESCRIPTION_MAX_LENGTH),
  descriptionEn: z.string().max(PRODUCT_DESCRIPTION_MAX_LENGTH).optional(),
  price: z.coerce.number().int().min(0).max(PRODUCT_PRICE_MAX),
  imageUrl: z.string().min(1),
  category: z.enum([PRODUCT_CATEGORY.CLASSIC, PRODUCT_CATEGORY.PREMIUM]),
  isActive: z.boolean(),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
