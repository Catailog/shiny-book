import { API_ERROR_CODES } from '@/constants/api-errors';
import { apiError, apiSuccess } from '@/lib/api/api-response';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { toPrintJobResponse } from '@/lib/vendors/to-print-job-response';

export async function GET(
  _request: Request,
  ctx: RouteContext<'/api/vendors/print-shop/jobs/[jobId]'>,
) {
  const { jobId } = await ctx.params;

  const supabase = createServiceRoleClient();
  const { data, error } = await supabase.from('print_jobs').select().eq('id', jobId).maybeSingle();

  if (error || !data) {
    return apiError(API_ERROR_CODES.NOT_FOUND, 'Print job not found');
  }

  const printJob = toPrintJobResponse(data);
  if (!printJob) {
    return apiError(API_ERROR_CODES.INTERNAL_ERROR, 'Failed to load print job');
  }

  return apiSuccess(printJob);
}
