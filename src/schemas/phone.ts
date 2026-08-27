import { z } from 'zod';

import { PHONE_MAX_LENGTH, PHONE_MIN_LENGTH, PHONE_REGEX } from '@/constants/phone';

// Normalizes to bare digits (drops hyphens/spaces) before validating length, so a value
// like "010-1234-5678" is accepted and stored as "01012345678".
export const phoneSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ''))
  .pipe(z.string().min(PHONE_MIN_LENGTH).max(PHONE_MAX_LENGTH).regex(PHONE_REGEX));
