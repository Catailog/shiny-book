import { describe, expect, it } from 'vitest';

import { phoneSchema } from '@/schemas/phone';

describe('phoneSchema', () => {
  it('strips hyphens and spaces and keeps the digits', () => {
    expect(phoneSchema.parse('010-1234-5678')).toBe('01012345678');
    expect(phoneSchema.parse('010 1234 5678')).toBe('01012345678');
  });

  it('accepts a value that is already bare digits', () => {
    expect(phoneSchema.parse('01012345678')).toBe('01012345678');
  });

  it('rejects a value that is too short once separators are removed', () => {
    expect(phoneSchema.safeParse('010-12').success).toBe(false);
  });

  it('rejects a value that is too long once separators are removed', () => {
    expect(phoneSchema.safeParse('010-1234-5678-9').success).toBe(false);
  });

  it('rejects letters', () => {
    expect(phoneSchema.safeParse('010abcd5678').success).toBe(false);
  });
});
