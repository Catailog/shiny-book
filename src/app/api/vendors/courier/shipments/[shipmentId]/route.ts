import { API_ERROR_CODES } from '@/constants/api-errors';
import { ROLE } from '@/constants/roles';
import { authenticateApiKey } from '@/lib/api/api-key-auth';
import { apiError, apiSuccess } from '@/lib/api/api-response';
import { hasRequiredRole } from '@/lib/api/require-role';
import { checkApiRateLimit } from '@/lib/rate-limit/api-key-rate-limit';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { toShipmentJobResponse } from '@/lib/vendors/to-shipment-job-response';

export async function GET(
  request: Request,
  ctx: RouteContext<'/api/vendors/courier/shipments/[shipmentId]'>,
) {
  const auth = await authenticateApiKey(request);
  if (!auth.isAuthorized) {
    return apiError(auth.errorCode, 'Invalid or missing API key');
  }

  const rateLimit = await checkApiRateLimit(auth.clientId);
  if (!rateLimit.isAllowed) {
    return apiError(API_ERROR_CODES.RATE_LIMITED, 'Too many requests');
  }

  if (!hasRequiredRole(auth.role, [ROLE.VENDOR, ROLE.ADMIN])) {
    return apiError(API_ERROR_CODES.FORBIDDEN, 'Not allowed to view shipment jobs');
  }

  const { shipmentId } = await ctx.params;

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('shipment_jobs')
    .select()
    .eq('id', shipmentId)
    .maybeSingle();

  if (error || !data) {
    return apiError(API_ERROR_CODES.NOT_FOUND, 'Shipment job not found');
  }

  const shipmentJob = toShipmentJobResponse(data);
  if (!shipmentJob) {
    return apiError(API_ERROR_CODES.INTERNAL_ERROR, 'Failed to load shipment job');
  }

  return apiSuccess(shipmentJob);
}
