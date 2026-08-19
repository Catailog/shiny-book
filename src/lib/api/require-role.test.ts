import { describe, expect, it } from 'vitest';

import { ROLE } from '@/constants/roles';
import { hasRequiredRole } from '@/lib/api/require-role';

describe('hasRequiredRole', () => {
  it('allows a role that is in the allowed list', () => {
    expect(hasRequiredRole(ROLE.ADMIN, [ROLE.ADMIN])).toBe(true);
  });

  it('allows a role when multiple roles are permitted', () => {
    expect(hasRequiredRole(ROLE.CONSUMER, [ROLE.CONSUMER, ROLE.ADMIN])).toBe(true);
  });

  it('rejects a role that is not in the allowed list', () => {
    expect(hasRequiredRole(ROLE.CONSUMER, [ROLE.ADMIN])).toBe(false);
  });

  it('rejects when the allowed list is empty', () => {
    expect(hasRequiredRole(ROLE.ADMIN, [])).toBe(false);
  });
});
