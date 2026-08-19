import { z } from 'zod';

import { INQUIRY_CONTENT_MAX_LENGTH, INQUIRY_TITLE_MAX_LENGTH } from '@/constants/inquiry';
import { INQUIRY_CATEGORY } from '@/constants/inquiry-category';

export const inquiryFormSchema = z.object({
  category: z.enum([INQUIRY_CATEGORY.GENERAL, INQUIRY_CATEGORY.ORDER]),
  orderId: z.string().uuid().optional(),
  title: z.string().min(1).max(INQUIRY_TITLE_MAX_LENGTH),
  content: z.string().min(1).max(INQUIRY_CONTENT_MAX_LENGTH),
});

export type InquiryFormInput = z.infer<typeof inquiryFormSchema>;
