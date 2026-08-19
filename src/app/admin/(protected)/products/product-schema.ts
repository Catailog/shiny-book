import { z } from 'zod';

import { PRODUCT_CATEGORY } from '@/constants/product-category';

export const productFormSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  nameEn: z.string().optional(),
  size: z.string().min(1),
  description: z.string().min(1),
  descriptionEn: z.string().optional(),
  price: z.coerce.number().int().min(0),
  imageUrl: z.string().min(1),
  category: z.enum([PRODUCT_CATEGORY.CLASSIC, PRODUCT_CATEGORY.PREMIUM]),
  isActive: z.boolean(),
});

export type ProductFormInput = z.infer<typeof productFormSchema>;
