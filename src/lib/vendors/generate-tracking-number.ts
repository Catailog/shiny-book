import { randomInt } from 'node:crypto';

export function generateTrackingNumber(): string {
  const digits = Array.from({ length: 12 }, () => randomInt(0, 10)).join('');
  return `CJ${digits}`;
}
