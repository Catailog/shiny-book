import type { NextRequest } from 'next/server';

import { API_ERROR_CODES } from '@/constants/api-errors';
import { PRINT_JOB_STATUS } from '@/constants/print-job-status';
import { apiError, apiSuccess } from '@/lib/api/api-response';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { toPrintJobResponse } from '@/lib/vendors/to-print-job-response';
import { createPrintJobRequestSchema } from '@/schemas/api/print-jobs';

export async function POST(request: NextRequest) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = createPrintJobRequestSchema.safeParse(body);

  if (!parsed.success) {
    return apiError(API_ERROR_CODES.VALIDATION_FAILED, 'Invalid print job payload');
  }

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase
    .from('print_jobs')
    .insert({
      order_id: parsed.data.orderId,
      status: PRINT_JOB_STATUS.RECEIVED,
      manuscript_file_url: parsed.data.manuscriptFileUrl,
      cover_file_url: parsed.data.coverFileUrl,
      quantity: parsed.data.quantity,
    })
    .select()
    .single();

  if (error || !data) {
    return apiError(API_ERROR_CODES.INTERNAL_ERROR, 'Failed to create print job');
  }

  const printJob = toPrintJobResponse(data);
  if (!printJob) {
    return apiError(API_ERROR_CODES.INTERNAL_ERROR, 'Failed to create print job');
  }

  return apiSuccess(printJob, 201);
}
