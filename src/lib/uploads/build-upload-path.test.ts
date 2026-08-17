import { describe, expect, it } from 'vitest';

import { FILE_UPLOAD_KIND } from '@/constants/file-upload';
import { buildProcessedPhotoPath, buildUploadPath } from '@/lib/uploads/build-upload-path';

describe('buildUploadPath', () => {
  it('scopes the path under the consumer id and kind', () => {
    const path = buildUploadPath('consumer-1', FILE_UPLOAD_KIND.PHOTO, 'photo.png');
    expect(path).toMatch(/^consumer-1\/photo\/raw-[0-9a-f-]+\.png$/);
  });

  it('omits the extension when the file name has none', () => {
    const path = buildUploadPath('consumer-1', FILE_UPLOAD_KIND.PHOTO, 'photo');
    expect(path).toMatch(/^consumer-1\/photo\/raw-[0-9a-f-]+$/);
  });
});

describe('buildProcessedPhotoPath', () => {
  it('replaces the raw prefix and forces a webp extension', () => {
    const rawPath = 'consumer-1/photo/raw-abc123.png';
    expect(buildProcessedPhotoPath(rawPath)).toBe('consumer-1/photo/processed-abc123.webp');
  });

  it('keeps the folder structure intact', () => {
    const rawPath = 'consumer-2/photo/raw-xyz.jpeg';
    expect(buildProcessedPhotoPath(rawPath)).toBe('consumer-2/photo/processed-xyz.webp');
  });
});
