import { randomUUID } from 'node:crypto';

import { type FileUploadKind, IMAGE_UPLOAD_EXTENSION_BY_MIME } from '@/constants/file-upload';

// Extension for a validated upload MIME type; empty for anything unrecognized. Never
// trust a client file name for the stored object path.
export function extensionForMimeType(mimeType: string): string {
  return IMAGE_UPLOAD_EXTENSION_BY_MIME[mimeType] ?? '';
}

export function buildUploadPath(
  consumerId: string,
  kind: FileUploadKind,
  mimeType: string,
): string {
  return `${consumerId}/${kind}/raw-${randomUUID()}${extensionForMimeType(mimeType)}`;
}

export function buildProcessedPhotoPath(rawPath: string): string {
  return rawPath.replace(/\/raw-/, '/processed-').replace(/\.[^./]+$/, '.webp');
}
