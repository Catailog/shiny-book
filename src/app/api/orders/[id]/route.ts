import type { NextRequest } from 'next/server';

import { API_ERROR_CODES } from '@/constants/api-errors';
import { ROLE } from '@/constants/roles';
import { authenticateApiKey } from '@/lib/api/api-key-auth';
import { apiError, apiSuccess } from '@/lib/api/api-response';
import { withRequestContext } from '@/lib/api/with-request-context';
import { toOrderResponse } from '@/lib/orders/to-order-response';
import { checkApiRateLimit } from '@/lib/rate-limit/api-key-rate-limit';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

async function getHandler(request: NextRequest, ctx: RouteContext<'/api/orders/[id]'>) {
  const auth = await authenticateApiKey(request);
  if (!auth.isAuthorized) {
    return apiError(auth.errorCode, 'Invalid or missing API key');
  }

  const rateLimit = await checkApiRateLimit(auth.clientId);
  if (!rateLimit.isAllowed) {
    return apiError(API_ERROR_CODES.RATE_LIMITED, 'Too many requests');
  }

  const { id } = await ctx.params;

  const supabase = createServiceRoleClient();
  const baseQuery = supabase.from('orders').select().eq('id', id);
  const scopedQuery =
    auth.role === ROLE.ADMIN ? baseQuery : baseQuery.eq('client_id', auth.clientId);

  const { data, error } = await scopedQuery.maybeSingle();

  if (error || !data) {
    return apiError(API_ERROR_CODES.NOT_FOUND, 'Order not found');
  }

  const order = toOrderResponse(data);
  if (!order) {
    return apiError(API_ERROR_CODES.INTERNAL_ERROR, 'Failed to load order');
  }

  return apiSuccess(order);
}

export const GET = withRequestContext(getHandler);
