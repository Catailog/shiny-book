import { z } from 'zod';

export const orderDetailsSchema = z.object({
  title: z.string().min(1).max(200),
  quantity: z.number().int().positive(),
});

export type OrderDetailsInput = z.infer<typeof orderDetailsSchema>;

export const createConsumerOrderSchema = orderDetailsSchema.extend({
  manuscriptPath: z.string().min(1),
  coverPath: z.string().min(1),
});

export type CreateConsumerOrderInput = z.infer<typeof createConsumerOrderSchema>;
