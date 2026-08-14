import { describe, expect, it } from 'vitest';

import { FILE_UPLOAD_KIND } from '@/constants/file-upload';
import { buildProcessedCoverPath, buildUploadPath } from '@/lib/uploads/build-upload-path';

describe('buildUploadPath', () => {
  it('scopes the path under the consumer id and kind', () => {
    const path = buildUploadPath('consumer-1', FILE_UPLOAD_KIND.COVER, 'cover.png');
    expect(path).toMatch(/^consumer-1\/cover\/raw-[0-9a-f-]+\.png$/);
  });

  it('omits the extension when the file name has none', () => {
    const path = buildUploadPath('consumer-1', FILE_UPLOAD_KIND.MANUSCRIPT, 'manuscript');
    expect(path).toMatch(/^consumer-1\/manuscript\/raw-[0-9a-f-]+$/);
  });
});

describe('buildProcessedCoverPath', () => {
  it('replaces the raw prefix and forces a webp extension', () => {
    const rawPath = 'consumer-1/cover/raw-abc123.png';
    expect(buildProcessedCoverPath(rawPath)).toBe('consumer-1/cover/processed-abc123.webp');
  });

  it('keeps the folder structure intact', () => {
    const rawPath = 'consumer-2/cover/raw-xyz.jpeg';
    expect(buildProcessedCoverPath(rawPath)).toBe('consumer-2/cover/processed-xyz.webp');
  });
});
