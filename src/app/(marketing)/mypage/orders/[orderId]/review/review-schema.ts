import { z } from 'zod';

import {
  REVIEW_CONTENT_MAX_LENGTH,
  REVIEW_RATING_MAX,
  REVIEW_RATING_MIN,
} from '@/constants/review';

export const reviewFormSchema = z.object({
  rating: z.number().int().min(REVIEW_RATING_MIN).max(REVIEW_RATING_MAX),
  content: z.string().max(REVIEW_CONTENT_MAX_LENGTH),
});

export type ReviewFormInput = z.infer<typeof reviewFormSchema>;
