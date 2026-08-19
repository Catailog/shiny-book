import { z } from 'zod';

import { FAQ_ANSWER_MAX_LENGTH, FAQ_QUESTION_MAX_LENGTH } from '@/constants/faq';

export const faqFormSchema = z.object({
  question: z.string().min(1).max(FAQ_QUESTION_MAX_LENGTH),
  answer: z.string().min(1).max(FAQ_ANSWER_MAX_LENGTH),
});

export type FaqFormInput = z.infer<typeof faqFormSchema>;
