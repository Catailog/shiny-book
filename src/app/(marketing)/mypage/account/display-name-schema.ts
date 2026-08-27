import { z } from 'zod';

import { DISPLAY_NAME_MAX_LENGTH } from '@/constants/auth';

export const displayNameSchema = z.object({
  displayName: z.string().min(1).max(DISPLAY_NAME_MAX_LENGTH),
});

export type DisplayNameInput = z.infer<typeof displayNameSchema>;
