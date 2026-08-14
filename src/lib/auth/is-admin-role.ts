import { ROLE, isRole } from '@/constants/roles';

export function isAdminRole(role: unknown): boolean {
  return typeof role === 'string' && isRole(role) && role === ROLE.ADMIN;
}
