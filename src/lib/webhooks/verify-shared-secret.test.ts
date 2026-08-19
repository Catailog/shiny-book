import { describe, expect, it } from 'vitest';

import { verifySharedSecret } from '@/lib/webhooks/verify-shared-secret';

describe('verifySharedSecret', () => {
  it('accepts a matching secret', () => {
    expect(verifySharedSecret('my-secret', 'my-secret')).toBe(true);
  });

  it('rejects a non-matching secret of the same length', () => {
    expect(verifySharedSecret('my-secreu', 'my-secret')).toBe(false);
  });

  it('rejects a secret of a different length', () => {
    expect(verifySharedSecret('short', 'much-longer-secret')).toBe(false);
  });

  it('rejects an empty received secret', () => {
    expect(verifySharedSecret('', 'my-secret')).toBe(false);
  });
});
