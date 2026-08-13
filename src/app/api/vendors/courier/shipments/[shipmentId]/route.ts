import { API_ERROR_CODES } from '@/constants/api-errors';
import { apiError, apiSuccess } from '@/lib/api/api-response';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { toShipmentJobResponse } from '@/lib/vendors/to-shipment-job-response';

export async function GET(
  _request: Request,
  ctx: RouteContext<'/api/vendors/courier/shipments/[shipmentId]'>,
) {
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
