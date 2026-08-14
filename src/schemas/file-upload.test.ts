import { describe, expect, it } from 'vitest';

import { FILE_UPLOAD_KIND, FILE_UPLOAD_RULES } from '@/constants/file-upload';
import { signedUploadUrlRequestSchema } from '@/schemas/file-upload';

describe('signedUploadUrlRequestSchema', () => {
  const validManuscriptPayload = {
    kind: FILE_UPLOAD_KIND.MANUSCRIPT,
    fileName: 'manuscript.pdf',
    fileType: 'application/pdf',
    fileSize: 1024,
  };

  const validCoverPayload = {
    kind: FILE_UPLOAD_KIND.COVER,
    fileName: 'cover.png',
    fileType: 'image/png',
    fileSize: 1024,
  };

  it('accepts a valid manuscript payload', () => {
    expect(signedUploadUrlRequestSchema.safeParse(validManuscriptPayload).success).toBe(true);
  });

  it('accepts a valid cover payload', () => {
    expect(signedUploadUrlRequestSchema.safeParse(validCoverPayload).success).toBe(true);
  });

  it('rejects a manuscript file type outside the allow list', () => {
    const result = signedUploadUrlRequestSchema.safeParse({
      ...validManuscriptPayload,
      fileType: 'image/png',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a cover file type outside the allow list', () => {
    const result = signedUploadUrlRequestSchema.safeParse({
      ...validCoverPayload,
      fileType: 'application/pdf',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a manuscript exceeding the max size', () => {
    const result = signedUploadUrlRequestSchema.safeParse({
      ...validManuscriptPayload,
      fileSize: FILE_UPLOAD_RULES[FILE_UPLOAD_KIND.MANUSCRIPT].maxSizeBytes + 1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects a cover exceeding the max size', () => {
    const result = signedUploadUrlRequestSchema.safeParse({
      ...validCoverPayload,
      fileSize: FILE_UPLOAD_RULES[FILE_UPLOAD_KIND.COVER].maxSizeBytes + 1,
    });
    expect(result.success).toBe(false);
  });

  it('rejects an empty file name', () => {
    const result = signedUploadUrlRequestSchema.safeParse({
      ...validManuscriptPayload,
      fileName: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a non-integer file size', () => {
    const result = signedUploadUrlRequestSchema.safeParse({
      ...validManuscriptPayload,
      fileSize: 1.5,
    });
    expect(result.success).toBe(false);
  });
});
