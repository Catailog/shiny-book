import { randomUUID } from 'node:crypto';

import { extensionForMimeType } from '@/lib/uploads/build-upload-path';

export function buildProductImagePath(mimeType: string): string {
  return `raw-${randomUUID()}${extensionForMimeType(mimeType)}`;
}
