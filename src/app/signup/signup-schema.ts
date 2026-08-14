import { z } from 'zod';

export const consumerSignupSchema = z
  .object({
    email: z.string().min(1).email(),
    password: z.string().min(6),
    passwordConfirm: z.string().min(1),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
  });

export type ConsumerSignupInput = z.infer<typeof consumerSignupSchema>;
