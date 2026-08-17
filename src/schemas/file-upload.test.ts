import { describe, expect, it } from 'vitest';

import { FILE_UPLOAD_KIND, FILE_UPLOAD_RULES } from '@/constants/file-upload';
import { signedUploadUrlRequestSchema } from '@/schemas/file-upload';

describe('signedUploadUrlRequestSchema', () => {
  const validPhotoPayload = {
    kind: FILE_UPLOAD_KIND.PHOTO,
    fileName: 'photo.png',
    fileType: 'image/png',
    fileSize: 1024,
  };

  it('accepts a valid photo payload', () => {
    expect(signedUploadUrlRequestSchema.safeParse(validPhotoPayload).success).toBe(true);
  });

  it('rejects a file type outside the allow list', () => {
    const result = signedUploadUrlRequestSchema.safeParse({
      ...validPhotoPayload,
      fileType: 'application/pdf',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a file exceeding the max size', () => {
    const result = signedUploadUrlRequestSchema.safeParse({
      ...validPhotoPayload,
      fileSize: FILE_UPLOAD_RULES[FILE_UPLOAD_KIND.PHOTO].maxSizeBytes + 1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects an empty file name', () => {
    const result = signedUploadUrlRequestSchema.safeParse({
      ...validPhotoPayload,
      fileName: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a non-integer file size', () => {
    const result = signedUploadUrlRequestSchema.safeParse({
      ...validPhotoPayload,
      fileSize: 1.5,
    });
    expect(result.success).toBe(false);
  });
});
