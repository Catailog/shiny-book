import { describe, expect, it } from 'vitest';

import { isApiErrorCode } from '@/constants/api-errors';

describe('isApiErrorCode', () => {
  it('accepts known error codes', () => {
    expect(isApiErrorCode('UNAUTHORIZED')).toBe(true);
    expect(isApiErrorCode('RATE_LIMITED')).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(isApiErrorCode('NOT_A_CODE')).toBe(false);
    expect(isApiErrorCode('')).toBe(false);
  });
});
