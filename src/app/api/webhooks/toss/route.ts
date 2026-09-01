import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { TOSS_PAYMENT_STATUS } from '@/constants/toss-payment-status';
import { TOSS_WEBHOOK_EVENT_TYPES } from '@/constants/toss-webhook-events';
import { withRequestContext } from '@/lib/api/with-request-context';
import { finalizeOrderPayment } from '@/lib/orders/finalize-order-payment';
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

  try {
    await finalizeOrderPayment(event.data.orderId, event.data.paymentKey);
  } catch (error) {
    console.error('[toss-webhook] failed to finalize order payment', {
      orderId: event.data.orderId,
      error: error instanceof Error ? error.message : error,
    });
    return NextResponse.json({ received: false }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

export const POST = withRequestContext(postHandler);
