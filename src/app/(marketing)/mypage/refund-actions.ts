'use server';

import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { requestRefund } from '@/lib/refunds/request-refund';
import { refundRequestInputSchema } from '@/schemas/refund';

export interface RequestRefundActionResult {
  errorCode?:
    | 'unauthorized'
    | 'validation_failed'
    | 'order_not_found'
    | 'not_refundable'
    | 'already_open'
    | 'amount_exceeds_remaining'
    | 'failed';
  remaining?: number;
}

export async function requestRefundAction(
  orderId: string,
  input: { reason: string; amount?: number },
): Promise<RequestRefundActionResult> {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    return { errorCode: 'unauthorized' };
  }

  const parsed = refundRequestInputSchema.safeParse(input);
  if (!parsed.success) {
    return { errorCode: 'validation_failed' };
  }

  const result = await requestRefund(orderId, consumer.id, parsed.data);

  switch (result.outcome) {
    case 'created':
      return {};
    case 'amount_exceeds_remaining':
      return { errorCode: 'amount_exceeds_remaining', remaining: result.remaining };
    default:
      return { errorCode: result.outcome };
  }
}
