import { z } from 'zod';

import { INQUIRY_CONTENT_MAX_LENGTH, INQUIRY_TITLE_MAX_LENGTH } from '@/constants/inquiry';

export const inquiryFormSchema = z.object({
  title: z.string().min(1).max(INQUIRY_TITLE_MAX_LENGTH),
  content: z.string().min(1).max(INQUIRY_CONTENT_MAX_LENGTH),
});

export type InquiryFormInput = z.infer<typeof inquiryFormSchema>;
