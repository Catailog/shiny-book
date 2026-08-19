import { z } from 'zod';

import { isApiErrorCode } from '@/constants/api-errors';

export const apiErrorSchema = z.object({
  code: z.string().refine(isApiErrorCode, { message: 'Unknown API error code' }),
  message: z.string(),
});

export function createSuccessEnvelopeSchema<DataSchema extends z.ZodTypeAny>(
  dataSchema: DataSchema,
) {
  return z.object({
    data: dataSchema,
    error: z.null(),
  });
}

export const errorEnvelopeSchema = z.object({
  data: z.null(),
  error: apiErrorSchema,
});

export type ApiError = z.infer<typeof apiErrorSchema>;
export type ErrorEnvelope = z.infer<typeof errorEnvelopeSchema>;
