import { z } from 'zod';

import { PHONE_MAX_LENGTH, PHONE_MIN_LENGTH, PHONE_REGEX } from '@/constants/phone';

export const phoneSchema = z
  .string()
  .min(PHONE_MIN_LENGTH)
  .max(PHONE_MAX_LENGTH)
  .regex(PHONE_REGEX);
