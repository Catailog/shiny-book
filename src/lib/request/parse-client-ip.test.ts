import { describe, expect, it } from 'vitest';

import { parseClientIp } from '@/lib/request/parse-client-ip';

describe('parseClientIp', () => {
  it('returns the first address when x-forwarded-for has multiple entries', () => {
    expect(parseClientIp('1.2.3.4, 5.6.7.8', null)).toBe('1.2.3.4');
  });

  it('trims whitespace around the first address', () => {
    expect(parseClientIp(' 1.2.3.4 , 5.6.7.8', null)).toBe('1.2.3.4');
  });

  it('falls back to x-real-ip when x-forwarded-for is missing', () => {
    expect(parseClientIp(null, '9.9.9.9')).toBe('9.9.9.9');
  });

  it('falls back to "unknown" when neither header is present', () => {
    expect(parseClientIp(null, null)).toBe('unknown');
  });
});
