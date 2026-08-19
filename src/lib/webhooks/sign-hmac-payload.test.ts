import { describe, expect, it } from 'vitest';

import { signHmacPayload } from '@/lib/webhooks/sign-hmac-payload';
import { verifyHmacSignature } from '@/lib/webhooks/verify-hmac-signature';

describe('signHmacPayload', () => {
  const secret = 'shared-secret';
  const payload = JSON.stringify({ jobId: 'job-1', status: 'done' });

  it('produces a signature that verifyHmacSignature accepts', () => {
    const signature = signHmacPayload(payload, secret);
    expect(verifyHmacSignature(payload, signature, secret)).toBe(true);
  });

  it('produces a base64 signature when requested', () => {
    const signature = signHmacPayload(payload, secret, 'base64');
    expect(verifyHmacSignature(payload, signature, secret, 'base64')).toBe(true);
  });

  it('produces different signatures for different secrets', () => {
    expect(signHmacPayload(payload, secret)).not.toBe(signHmacPayload(payload, 'other-secret'));
  });
});
