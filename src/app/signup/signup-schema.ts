import { z } from 'zod';

import { passwordSchema } from '@/schemas/password';

export const consumerSignupSchema = z
  .object({
    name: z.string().min(1),
    email: z.string().email(),
    password: passwordSchema,
    passwordConfirm: z.string().min(1),
    phone: z.string().optional(),
    agreeTerms: z.boolean().refine((value) => value === true),
    agreePrivacy: z.boolean().refine((value) => value === true),
    marketingEmailConsent: z.boolean(),
    marketingSmsConsent: z.boolean(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
  });

export type ConsumerSignupInput = z.infer<typeof consumerSignupSchema>;
