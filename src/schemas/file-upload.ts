import { z } from 'zod';

import { FILE_UPLOAD_KIND, FILE_UPLOAD_RULES } from '@/constants/file-upload';

export const signedUploadUrlRequestSchema = z
  .object({
    kind: z.enum([FILE_UPLOAD_KIND.PHOTO, FILE_UPLOAD_KIND.AVATAR]),
    fileType: z.string().min(1),
    fileSize: z.number().int().positive(),
  })
  .refine((data) => FILE_UPLOAD_RULES[data.kind].allowedMimeTypes.includes(data.fileType), {
    path: ['fileType'],
  })
  .refine((data) => data.fileSize <= FILE_UPLOAD_RULES[data.kind].maxSizeBytes, {
    path: ['fileSize'],
  });

export type SignedUploadUrlRequest = z.infer<typeof signedUploadUrlRequestSchema>;

const orderPhotoUploadTicketRequestSchema = z
  .object({
    fileType: z.string().min(1),
    fileSize: z.number().int().positive(),
  })
  .refine(
    (data) => FILE_UPLOAD_RULES[FILE_UPLOAD_KIND.PHOTO].allowedMimeTypes.includes(data.fileType),
    {
      path: ['fileType'],
    },
  )
  .refine((data) => data.fileSize <= FILE_UPLOAD_RULES[FILE_UPLOAD_KIND.PHOTO].maxSizeBytes, {
    path: ['fileSize'],
  });

// One Server Action mints signed upload URLs for a whole batch of order photos so the
// per-photo count of Server Action round trips stays low (Next.js runs Server Actions
// sequentially and the proxy rate-limits them).
export const orderPhotoUploadTicketsRequestSchema = z
  .array(orderPhotoUploadTicketRequestSchema)
  .min(1)
  .max(200);

export type OrderPhotoUploadTicketsRequest = z.infer<typeof orderPhotoUploadTicketsRequestSchema>;
