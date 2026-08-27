import { z } from 'zod';

import { phoneSchema } from '@/schemas/phone';

export const phoneFormSchema = z.object({
  phone: phoneSchema.optional(),
});

export type PhoneFormInput = z.infer<typeof phoneFormSchema>;
