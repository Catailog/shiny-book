import { z } from 'zod';

export const changePasswordSchema = z
  .object({
    password: z.string().min(6),
    passwordConfirm: z.string().min(1),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
