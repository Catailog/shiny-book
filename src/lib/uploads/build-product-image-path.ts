import { randomUUID } from 'node:crypto';

import { getFileExtension } from '@/lib/uploads/build-upload-path';

export function buildProductImagePath(fileName: string): string {
  return `raw-${randomUUID()}${getFileExtension(fileName)}`;
}
