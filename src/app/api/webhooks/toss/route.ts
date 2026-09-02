import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ORDER_EVENT_SOURCE, ORDER_EVENT_TYPE } from '@/constants/order-event';
import { TOSS_PAYMENT_STATUS } from '@/constants/toss-payment-status';
import { TOSS_WEBHOOK_EVENT_TYPES } from '@/constants/toss-webhook-events';
import { withRequestContext } from '@/lib/api/with-request-context';
import { logger } from '@/lib/log/logger';
import { finalizeOrderPayment } from '@/lib/orders/finalize-order-payment';
import { recordOrderEvent } from '@/lib/orders/record-order-event';
import { markWebhookEventProcessed } from '@/lib/webhooks/check-webhook-idempotency';
import { parseTossPaymentWebhook } from '@/lib/webhooks/parse-toss-payment-webhook';

async function postHandler(request: NextRequest) {
  const transmissionId = request.headers.get('tosspayments-webhook-transmission-id');
  const body: unknown = await request.json().catch(() => null);
  const event = parseTossPaymentWebhook(body);

  if (
    !event ||
    event.eventType !== TOSS_WEBHOOK_EVENT_TYPES.PAYMENT_STATUS_CHANGED ||
    event.data.status !== TOSS_PAYMENT_STATUS.DONE
  ) {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  if (transmissionId) {
    const isFirstDelivery = await markWebhookEventProcessed(transmissionId);
    if (!isFirstDelivery) {
      return NextResponse.json({ received: true }, { status: 200 });
    }
  }

  await recordOrderEvent({
    orderId: event.data.orderId,
    eventType: ORDER_EVENT_TYPE.WEBHOOK_RECEIVED,
    source: ORDER_EVENT_SOURCE.WEBHOOK,
    actor: 'webhook:toss',
    metadata: { provider: 'toss', eventId: transmissionId ?? undefined },
  });

  try {
    await finalizeOrderPayment(event.data.orderId, event.data.paymentKey);
  } catch (error) {
    logger.error(
      {
        event: 'toss.webhook.finalize_failed',
        orderId: event.data.orderId,
        err:
          error instanceof Error
            ? { message: error.message, stack: error.stack }
            : { value: String(error) },
      },
      'failed to finalize order payment from toss webhook',
    );
    return NextResponse.json({ received: false }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

export const POST = withRequestContext(postHandler);
