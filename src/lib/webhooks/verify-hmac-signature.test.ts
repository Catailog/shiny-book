import { createHmac } from 'node:crypto';
import { describe, expect, it } from 'vitest';

import { verifyHmacSignature } from '@/lib/webhooks/verify-hmac-signature';

describe('verifyHmacSignature', () => {
  const secret = 'webhook-secret';
  const payload = JSON.stringify({ orderId: 'order-1', status: 'paid' });

  it('accepts a valid hex signature', () => {
    const signature = createHmac('sha256', secret).update(payload).digest('hex');
    expect(verifyHmacSignature(payload, signature, secret)).toBe(true);
  });

  it('accepts a valid base64 signature', () => {
    const signature = createHmac('sha256', secret).update(payload).digest('base64');
    expect(verifyHmacSignature(payload, signature, secret, 'base64')).toBe(true);
  });

  it('rejects a signature computed with the wrong secret', () => {
    const signature = createHmac('sha256', 'wrong-secret').update(payload).digest('hex');
    expect(verifyHmacSignature(payload, signature, secret)).toBe(false);
  });

  it('rejects a signature for a tampered payload', () => {
    const signature = createHmac('sha256', secret).update(payload).digest('hex');
    const tamperedPayload = JSON.stringify({ orderId: 'order-1', status: 'cancelled' });
    expect(verifyHmacSignature(tamperedPayload, signature, secret)).toBe(false);
  });

  it('rejects a malformed signature', () => {
    expect(verifyHmacSignature(payload, 'not-a-real-signature', secret)).toBe(false);
  });
});
