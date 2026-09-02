import type { NextRequest } from 'next/server';

import { randomUUID } from 'node:crypto';

import { API_ERROR_CODES } from '@/constants/api-errors';
import { VENDOR_WEBHOOK_SECRET } from '@/constants/vendor-webhook';
import { apiError, apiSuccess } from '@/lib/api/api-response';
import { withRequestContext } from '@/lib/api/with-request-context';
import { signHmacPayload } from '@/lib/webhooks/sign-hmac-payload';
import { simulateVendorWebhookRequestSchema } from '@/schemas/api/simulate-vendor-webhook';

async function postHandler(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = simulateVendorWebhookRequestSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(API_ERROR_CODES.VALIDATION_FAILED, 'Invalid simulate webhook payload');
  }

  const payload = JSON.stringify(parsed.data);
  const signature = signHmacPayload(payload, VENDOR_WEBHOOK_SECRET);
  const eventId = randomUUID();

  const response = await fetch(new URL('/api/webhooks/vendor', request.url), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-vendor-webhook-signature': signature,
      'x-vendor-webhook-event-id': eventId,
    },
    body: payload,
  });

  const webhookResponse: unknown = await response.json().catch(() => null);

  return apiSuccess({ delivered: response.ok, eventId, webhookResponse });
}

export const POST = withRequestContext(postHandler);
