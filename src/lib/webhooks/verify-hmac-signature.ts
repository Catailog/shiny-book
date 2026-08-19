import { createHmac, timingSafeEqual } from 'node:crypto';

export function verifyHmacSignature(
  payload: string,
  signature: string,
  secret: string,
  encoding: 'hex' | 'base64' = 'hex',
): boolean {
  const expectedSignature = createHmac('sha256', secret).update(payload).digest(encoding);

  const expectedBuffer = Buffer.from(expectedSignature, encoding);
  const actualBuffer = Buffer.from(signature, encoding);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}
