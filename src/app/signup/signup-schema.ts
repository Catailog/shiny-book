import { z } from 'zod';

import { EMAIL_MAX_LENGTH } from '@/constants/auth';
import { PERSON_NAME_MAX_LENGTH } from '@/constants/person-name';
import { passwordSchema } from '@/schemas/password';
import { phoneSchema } from '@/schemas/phone';

export const consumerSignupSchema = z
  .object({
    name: z.string().min(1).max(PERSON_NAME_MAX_LENGTH),
    email: z.string().email().max(EMAIL_MAX_LENGTH),
    password: passwordSchema,
    passwordConfirm: z.string().min(1),
    phone: phoneSchema.optional(),
    agreeTerms: z.boolean().refine((value) => value === true),
    agreePrivacy: z.boolean().refine((value) => value === true),
    marketingEmailConsent: z.boolean(),
    marketingSmsConsent: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
  });

export type ConsumerSignupInput = z.infer<typeof consumerSignupSchema>;
