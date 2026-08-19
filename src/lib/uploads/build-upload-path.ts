import { randomUUID } from 'node:crypto';

import type { FileUploadKind } from '@/constants/file-upload';

export function getFileExtension(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf('.');
  return lastDotIndex === -1 ? '' : fileName.slice(lastDotIndex);
}

export function buildUploadPath(
  consumerId: string,
  kind: FileUploadKind,
  fileName: string,
): string {
  return `${consumerId}/${kind}/raw-${randomUUID()}${getFileExtension(fileName)}`;
}

export function buildProcessedPhotoPath(rawPath: string): string {
  return rawPath.replace(/\/raw-/, '/processed-').replace(/\.[^./]+$/, '.webp');
}
