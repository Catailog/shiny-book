import type { NextRequest } from 'next/server';

import { API_ERROR_CODES } from '@/constants/api-errors';
import { ORDER_EVENT_SOURCE, ORDER_EVENT_TYPE } from '@/constants/order-event';
import { ORDER_STATUS } from '@/constants/order-status';
import { PRICING } from '@/constants/pricing';
import { ROLE } from '@/constants/roles';
import { authenticateApiKey } from '@/lib/api/api-key-auth';
import { apiError, apiSuccess } from '@/lib/api/api-response';
import { hasRequiredRole } from '@/lib/api/require-role';
import { withRequestContext } from '@/lib/api/with-request-context';
import { recordOrderEvent } from '@/lib/orders/record-order-event';
import { toOrderResponse } from '@/lib/orders/to-order-response';
import { checkApiRateLimit } from '@/lib/rate-limit/api-key-rate-limit';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { createOrderRequestSchema } from '@/schemas/api/orders';

async function postHandler(request: NextRequest) {
  const auth = await authenticateApiKey(request);
  if (!auth.isAuthorized) {
    return apiError(auth.errorCode, 'Invalid or missing API key');
  }

  const rateLimit = await checkApiRateLimit(auth.clientId);
  if (!rateLimit.isAllowed) {
    return apiError(API_ERROR_CODES.RATE_LIMITED, 'Too many requests');
  }

  if (!hasRequiredRole(auth.role, [ROLE.CONSUMER, ROLE.ADMIN])) {
    return apiError(API_ERROR_CODES.FORBIDDEN, 'Not allowed to create orders');
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = createOrderRequestSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(API_ERROR_CODES.VALIDATION_FAILED, 'Invalid order payload');
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('orders')
    .insert({
      client_id: auth.clientId,
      status: ORDER_STATUS.AWAITING_PAYMENT,
      title: parsed.data.title,
      manuscript_file_url: parsed.data.manuscriptFileUrl,
      cover_file_url: parsed.data.coverFileUrl,
      quantity: parsed.data.quantity,
      amount: parsed.data.quantity * PRICING.BOOK_UNIT_PRICE_KRW,
    })
    .select()
    .single();

  if (error || !data) {
    return apiError(API_ERROR_CODES.INTERNAL_ERROR, 'Failed to create order');
  }

  const order = toOrderResponse(data);
  if (!order) {
    return apiError(API_ERROR_CODES.INTERNAL_ERROR, 'Failed to create order');
  }

  await recordOrderEvent({
    orderId: data.id,
    eventType: ORDER_EVENT_TYPE.ORDER_CREATED,
    source: ORDER_EVENT_SOURCE.SYSTEM,
    actor: `api:${auth.clientId}`,
    toStatus: ORDER_STATUS.AWAITING_PAYMENT,
    metadata: { quantity: data.quantity, amount: data.amount },
  });

  return apiSuccess(order, 201);
}

export const POST = withRequestContext(postHandler);
