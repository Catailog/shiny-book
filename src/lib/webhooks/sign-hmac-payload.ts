import { createHmac } from 'node:crypto';

export function signHmacPayload(
  payload: string,
  secret: string,
  encoding: 'hex' | 'base64' = 'hex',
): string {
  return createHmac('sha256', secret).update(payload).digest(encoding);
}
