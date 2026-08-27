import { z } from 'zod';

import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/constants/auth';

export const passwordSchema = z.string().min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH);
