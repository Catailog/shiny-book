import { z } from 'zod';

import { PRODUCT_IMAGE_UPLOAD_RULE } from '@/constants/file-upload';

export const productImageSignedUploadUrlRequestSchema = z
  .object({
    fileName: z.string().min(1).max(255),
    fileType: z.string().min(1),
    fileSize: z.number().int().positive(),
  })
  .refine((data) => PRODUCT_IMAGE_UPLOAD_RULE.allowedMimeTypes.includes(data.fileType), {
    path: ['fileType'],
  })
  .refine((data) => data.fileSize <= PRODUCT_IMAGE_UPLOAD_RULE.maxSizeBytes, {
    path: ['fileSize'],
  });

export type ProductImageSignedUploadUrlRequest = z.infer<
  typeof productImageSignedUploadUrlRequestSchema
>;
