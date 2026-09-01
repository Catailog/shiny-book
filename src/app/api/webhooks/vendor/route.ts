import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

import { ORDER_STATUS } from '@/constants/order-status';
import { PRINT_JOB_STATUS, isPrintJobStatus } from '@/constants/print-job-status';
import { SHIPMENT_JOB_STATUS, isShipmentJobStatus } from '@/constants/shipment-job-status';
import { VENDOR_TYPES, VENDOR_WEBHOOK_SECRET } from '@/constants/vendor-webhook';
import { withRequestContext } from '@/lib/api/with-request-context';
import { transitionOrderStatus } from '@/lib/orders/transition-order-status';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { markWebhookEventProcessed } from '@/lib/webhooks/check-webhook-idempotency';
import { parseVendorWebhook } from '@/lib/webhooks/parse-vendor-webhook';
import { verifyHmacSignature } from '@/lib/webhooks/verify-hmac-signature';

async function postHandler(request: NextRequest) {
  const signature = request.headers.get('x-vendor-webhook-signature');
  const eventId = request.headers.get('x-vendor-webhook-event-id');
  const rawBody = await request.text();

  if (!signature || !eventId || !verifyHmacSignature(rawBody, signature, VENDOR_WEBHOOK_SECRET)) {
    return NextResponse.json({ received: false }, { status: 401 });
  }

  let parsedBody: unknown;
  try {
    parsedBody = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  const event = parseVendorWebhook(parsedBody);
  if (!event) {
    return NextResponse.json({ received: false }, { status: 400 });
  }

  const isFirstDelivery = await markWebhookEventProcessed(eventId);
  if (!isFirstDelivery) {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  const supabase = createServiceRoleClient();

  if (event.vendor === VENDOR_TYPES.PRINT_SHOP) {
    if (!isPrintJobStatus(event.status)) {
      return NextResponse.json({ received: false }, { status: 400 });
    }

    const { data: printJob } = await supabase
      .from('print_jobs')
      .update({ status: event.status })
      .eq('id', event.jobId)
      .select()
      .maybeSingle();

    if (printJob && event.status === PRINT_JOB_STATUS.DONE) {
      await transitionOrderStatus(printJob.order_id, ORDER_STATUS.PRINTING, ORDER_STATUS.BINDING);
    }
  } else if (event.vendor === VENDOR_TYPES.COURIER) {
    if (!isShipmentJobStatus(event.status)) {
      return NextResponse.json({ received: false }, { status: 400 });
    }

    const { data: shipmentJob } = await supabase
      .from('shipment_jobs')
      .update({ status: event.status })
      .eq('id', event.jobId)
      .select()
      .maybeSingle();

    if (shipmentJob && event.status === SHIPMENT_JOB_STATUS.DELIVERED) {
      await transitionOrderStatus(
        shipmentJob.order_id,
        ORDER_STATUS.SHIPPING,
        ORDER_STATUS.COMPLETED,
      );
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

export const POST = withRequestContext(postHandler);
