import { z } from 'zod';

import { ORDER_STATUS } from '@/constants/order-status';
import { createSuccessEnvelopeSchema } from '@/schemas/api/envelope';

export const createOrderRequestSchema = z.object({
  title: z.string().min(1).max(200),
  manuscriptFileUrl: z.string().url(),
  coverFileUrl: z.string().url(),
  quantity: z.number().int().positive(),
});

export type CreateOrderRequest = z.infer<typeof createOrderRequestSchema>;

export const orderResponseSchema = z.object({
  id: z.string(),
  status: z.enum([
    ORDER_STATUS.AWAITING_PAYMENT,
    ORDER_STATUS.PAID,
    ORDER_STATUS.PRINTING,
    ORDER_STATUS.BINDING,
    ORDER_STATUS.SHIPPING,
    ORDER_STATUS.COMPLETED,
  ]),
  title: z.string(),
  manuscriptFileUrl: z.string(),
  coverFileUrl: z.string(),
  quantity: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type OrderResponse = z.infer<typeof orderResponseSchema>;

export const orderSuccessEnvelopeSchema = createSuccessEnvelopeSchema(orderResponseSchema);
