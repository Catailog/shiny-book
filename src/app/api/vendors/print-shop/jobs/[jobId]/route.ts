import { API_ERROR_CODES } from '@/constants/api-errors';
import { ROLE } from '@/constants/roles';
import { authenticateApiKey } from '@/lib/api/api-key-auth';
import { apiError, apiSuccess } from '@/lib/api/api-response';
import { hasRequiredRole } from '@/lib/api/require-role';
import { withRequestContext } from '@/lib/api/with-request-context';
import { checkApiRateLimit } from '@/lib/rate-limit/api-key-rate-limit';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { toPrintJobResponse } from '@/lib/vendors/to-print-job-response';

async function getHandler(
  request: Request,
  ctx: RouteContext<'/api/vendors/print-shop/jobs/[jobId]'>,
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
    return apiError(API_ERROR_CODES.FORBIDDEN, 'Not allowed to view print jobs');
  }

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

export const GET = withRequestContext(getHandler);
