import { isPrintJobStatus } from '@/constants/print-job-status';
import type { Tables } from '@/lib/db/database.types';
import type { PrintJobResponse } from '@/schemas/api/print-jobs';

export function toPrintJobResponse(printJob: Tables<'print_jobs'>): PrintJobResponse | null {
  if (!isPrintJobStatus(printJob.status)) {
    return null;
  }

  return {
    id: printJob.id,
    orderId: printJob.order_id,
    status: printJob.status,
    manuscriptFileUrl: printJob.manuscript_file_url,
    coverFileUrl: printJob.cover_file_url,
    quantity: printJob.quantity,
    createdAt: printJob.created_at,
    updatedAt: printJob.updated_at,
  };
}
