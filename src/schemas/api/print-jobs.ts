import { z } from 'zod';

import { PRINT_JOB_STATUS } from '@/constants/print-job-status';
import { createSuccessEnvelopeSchema } from '@/schemas/api/envelope';

export const createPrintJobRequestSchema = z.object({
  orderId: z.string(),
  manuscriptFileUrl: z.string().url(),
  coverFileUrl: z.string().url(),
  quantity: z.number().int().positive(),
});

export type CreatePrintJobRequest = z.infer<typeof createPrintJobRequestSchema>;

export const printJobResponseSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  status: z.enum([PRINT_JOB_STATUS.RECEIVED, PRINT_JOB_STATUS.PRINTING, PRINT_JOB_STATUS.DONE]),
  manuscriptFileUrl: z.string(),
  coverFileUrl: z.string(),
  quantity: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type PrintJobResponse = z.infer<typeof printJobResponseSchema>;

export const printJobSuccessEnvelopeSchema = createSuccessEnvelopeSchema(printJobResponseSchema);
