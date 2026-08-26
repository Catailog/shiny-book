import { describe, expect, it } from 'vitest';

import { isRole } from '@/constants/roles';

describe('isRole', () => {
  it('accepts known roles', () => {
    expect(isRole('consumer')).toBe(true);
    expect(isRole('admin')).toBe(true);
    expect(isRole('vendor')).toBe(true);
  });

  it('rejects unknown values', () => {
    expect(isRole('superuser')).toBe(false);
    expect(isRole('')).toBe(false);
  });
});
