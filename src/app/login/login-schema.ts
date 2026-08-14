import { z } from 'zod';

export const consumerLoginSchema = z.object({
  email: z.string().min(1).email(),
  password: z.string().min(1),
});

export type ConsumerLoginInput = z.infer<typeof consumerLoginSchema>;
