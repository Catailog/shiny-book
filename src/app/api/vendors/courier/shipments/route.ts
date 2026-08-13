import type { NextRequest } from 'next/server';

import { API_ERROR_CODES } from '@/constants/api-errors';
import { SHIPMENT_JOB_STATUS } from '@/constants/shipment-job-status';
import { apiError, apiSuccess } from '@/lib/api/api-response';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { generateTrackingNumber } from '@/lib/vendors/generate-tracking-number';
import { toShipmentJobResponse } from '@/lib/vendors/to-shipment-job-response';
import { createShipmentJobRequestSchema } from '@/schemas/api/shipment-jobs';

export async function POST(request: NextRequest) {
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

  return apiSuccess(shipmentJob, 201);
}
