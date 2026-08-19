import type { Role } from '@/constants/roles';

export function hasRequiredRole(role: Role, allowedRoles: readonly Role[]): boolean {
  return allowedRoles.includes(role);
}
