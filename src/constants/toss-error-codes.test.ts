import { describe, expect, it } from 'vitest';

import { getTossErrorCode } from '@/constants/toss-error-codes';

describe('getTossErrorCode', () => {
  it('extracts the code from an error-like object', () => {
    expect(getTossErrorCode({ code: 'USER_CANCEL' })).toBe('USER_CANCEL');
  });

  it('returns null when there is no code property', () => {
    expect(getTossErrorCode(new Error('oops'))).toBeNull();
  });

  it('returns null for non-object values', () => {
    expect(getTossErrorCode('oops')).toBeNull();
    expect(getTossErrorCode(null)).toBeNull();
    expect(getTossErrorCode(undefined)).toBeNull();
  });

  it('returns null when the code property is not a string', () => {
    expect(getTossErrorCode({ code: 42 })).toBeNull();
  });
});
