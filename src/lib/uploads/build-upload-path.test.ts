import { describe, expect, it } from 'vitest';

import { FILE_UPLOAD_KIND } from '@/constants/file-upload';
import {
  buildProcessedPhotoPath,
  buildUploadPath,
  extensionForMimeType,
} from '@/lib/uploads/build-upload-path';

describe('extensionForMimeType', () => {
  it('maps known image types', () => {
    expect(extensionForMimeType('image/png')).toBe('.png');
    expect(extensionForMimeType('image/jpeg')).toBe('.jpg');
    expect(extensionForMimeType('image/webp')).toBe('.webp');
  });

  it('returns empty for an unrecognized type', () => {
    expect(extensionForMimeType('text/html')).toBe('');
    expect(extensionForMimeType('application/octet-stream')).toBe('');
  });
});

describe('buildUploadPath', () => {
  it('scopes the path under the consumer id and kind with an extension from the MIME type', () => {
    const path = buildUploadPath('consumer-1', FILE_UPLOAD_KIND.PHOTO, 'image/png');
    expect(path).toMatch(/^consumer-1\/photo\/raw-[0-9a-f-]+\.png$/);
  });

  it('never derives the object name from a caller-supplied file name', () => {
    const path = buildUploadPath('consumer-1', FILE_UPLOAD_KIND.PHOTO, 'application/octet-stream');
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
