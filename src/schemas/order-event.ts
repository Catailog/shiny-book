import { z } from 'zod';

import { ORDER_EVENT_TYPE, type OrderEventType } from '@/constants/order-event';

// `metadata` shape per event type. Kept as plain `z.object` so unknown keys are
// stripped on the write path; no PII (recipient email/phone/address, names) goes
// in here - only ids, amounts, and status codes.
const orderCreatedMetadata = z.object({
  productId: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  amount: z.number().int().nonnegative().optional(),
});

const orderStatusChangedMetadata = z.object({
  paymentKey: z.string().optional(),
  amount: z.number().int().optional(),
  trackingNumber: z.string().optional(),
  carrier: z.string().optional(),
  cancelAmount: z.number().int().nonnegative().optional(),
  transactionKey: z.string().optional(),
});

const webhookReceivedMetadata = z.object({
  provider: z.enum(['toss', 'vendor']),
  eventId: z.string().optional(),
});

const notificationSentMetadata = z.object({
  channel: z.literal('email'),
  template: z.string().optional(),
  delivered: z.boolean().optional(),
});

const adminNoteMetadata = z.object({});

const refundRequestedMetadata = z.object({
  refundRequestId: z.string(),
  amount: z.number().int().positive().optional(),
});

const refundReviewedMetadata = z.object({
  refundRequestId: z.string(),
});

const refundCompletedMetadata = z.object({
  refundRequestId: z.string(),
  amount: z.number().int().positive(),
  transactionKey: z.string().optional(),
});

export const ORDER_EVENT_METADATA_SCHEMA = {
  [ORDER_EVENT_TYPE.ORDER_CREATED]: orderCreatedMetadata,
  [ORDER_EVENT_TYPE.ORDER_STATUS_CHANGED]: orderStatusChangedMetadata,
  [ORDER_EVENT_TYPE.WEBHOOK_RECEIVED]: webhookReceivedMetadata,
  [ORDER_EVENT_TYPE.NOTIFICATION_SENT]: notificationSentMetadata,
  [ORDER_EVENT_TYPE.ADMIN_NOTE]: adminNoteMetadata,
  [ORDER_EVENT_TYPE.REFUND_REQUESTED]: refundRequestedMetadata,
  [ORDER_EVENT_TYPE.REFUND_APPROVED]: refundReviewedMetadata,
  [ORDER_EVENT_TYPE.REFUND_REJECTED]: refundReviewedMetadata,
  [ORDER_EVENT_TYPE.REFUND_COMPLETED]: refundCompletedMetadata,
} as const satisfies Record<OrderEventType, z.ZodType>;

export type OrderEventMetadata = z.infer<
  (typeof ORDER_EVENT_METADATA_SCHEMA)[keyof typeof ORDER_EVENT_METADATA_SCHEMA]
>;

// Validate a metadata object against its event type. Returns the parsed
// (unknown-keys-stripped) object, or null when it does not fit the shape.
export function parseOrderEventMetadata(
  eventType: OrderEventType,
  metadata: unknown,
): OrderEventMetadata | null {
  const result = ORDER_EVENT_METADATA_SCHEMA[eventType].safeParse(metadata ?? {});
  return result.success ? result.data : null;
}
