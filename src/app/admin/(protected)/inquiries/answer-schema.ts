import { z } from 'zod';

import { INQUIRY_ANSWER_MAX_LENGTH } from '@/constants/inquiry';

export const answerFormSchema = z.object({
  answer: z.string().min(1).max(INQUIRY_ANSWER_MAX_LENGTH),
});

export type AnswerFormInput = z.infer<typeof answerFormSchema>;
