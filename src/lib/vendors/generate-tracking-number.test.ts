import { describe, expect, it } from 'vitest';

import { generateTrackingNumber } from '@/lib/vendors/generate-tracking-number';

describe('generateTrackingNumber', () => {
  it('produces a CJ-prefixed 12-digit tracking number', () => {
    expect(generateTrackingNumber()).toMatch(/^CJ\d{12}$/);
  });

  it('produces different values on each call', () => {
    const a = generateTrackingNumber();
    const b = generateTrackingNumber();
    expect(a).not.toBe(b);
  });
});
