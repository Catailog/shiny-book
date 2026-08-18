import { z } from 'zod';

import { FILE_UPLOAD_KIND, FILE_UPLOAD_RULES } from '@/constants/file-upload';

export const signedUploadUrlRequestSchema = z
  .object({
    kind: z.enum([FILE_UPLOAD_KIND.PHOTO, FILE_UPLOAD_KIND.AVATAR]),
    fileName: z.string().min(1).max(255),
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
