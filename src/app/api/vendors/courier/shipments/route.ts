import type { NextRequest } from 'next/server';

import { API_ERROR_CODES } from '@/constants/api-errors';
import { ORDER_STATUS } from '@/constants/order-status';
import { ROLE } from '@/constants/roles';
import { SHIPMENT_JOB_STATUS } from '@/constants/shipment-job-status';
import { authenticateApiKey } from '@/lib/api/api-key-auth';
import { apiError, apiSuccess } from '@/lib/api/api-response';
import { hasRequiredRole } from '@/lib/api/require-role';
import { withRequestContext } from '@/lib/api/with-request-context';
import { transitionOrderStatus } from '@/lib/orders/transition-order-status';
import { checkApiRateLimit } from '@/lib/rate-limit/api-key-rate-limit';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { generateTrackingNumber } from '@/lib/vendors/generate-tracking-number';
import { toShipmentJobResponse } from '@/lib/vendors/to-shipment-job-response';
import { createShipmentJobRequestSchema } from '@/schemas/api/shipment-jobs';

async function postHandler(request: NextRequest) {
  const auth = await authenticateApiKey(request);
  if (!auth.isAuthorized) {
    return apiError(auth.errorCode, 'Invalid or missing API key');
  }

  const rateLimit = await checkApiRateLimit(auth.clientId);
  if (!rateLimit.isAllowed) {
    return apiError(API_ERROR_CODES.RATE_LIMITED, 'Too many requests');
  }

  if (!hasRequiredRole(auth.role, [ROLE.VENDOR, ROLE.ADMIN])) {
    return apiError(API_ERROR_CODES.FORBIDDEN, 'Not allowed to create shipment jobs');
  }

  const body: unknown = await request.json().catch(() => null);
  const parsed = createShipmentJobRequestSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(API_ERROR_CODES.VALIDATION_FAILED, 'Invalid shipment job payload');
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('shipment_jobs')
    .insert({
      order_id: parsed.data.orderId,
      status: SHIPMENT_JOB_STATUS.RECEIVED,
      tracking_number: generateTrackingNumber(),
    })
    .select()
    .single();

  if (error || !data) {
    return apiError(API_ERROR_CODES.INTERNAL_ERROR, 'Failed to create shipment job');
  }

  const shipmentJob = toShipmentJobResponse(data);
  if (!shipmentJob) {
    return apiError(API_ERROR_CODES.INTERNAL_ERROR, 'Failed to create shipment job');
  }

  await transitionOrderStatus(parsed.data.orderId, ORDER_STATUS.BINDING, ORDER_STATUS.SHIPPING);

  return apiSuccess(shipmentJob, 201);
}

export const POST = withRequestContext(postHandler);
