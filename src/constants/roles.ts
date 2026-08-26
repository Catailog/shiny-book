export const ROLE = {
  CONSUMER: 'consumer',
  ADMIN: 'admin',
  VENDOR: 'vendor',
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

const ROLE_VALUES: readonly Role[] = Object.values(ROLE);

export function isRole(value: string): value is Role {
  return ROLE_VALUES.some((role) => role === value);
}
