import { z } from 'zod';

import { passwordSchema } from '@/schemas/password';

export const changePasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: z.string().min(1),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
