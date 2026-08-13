export const ROLE = {
  CONSUMER: 'consumer',
  ADMIN: 'admin',
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

export function isRole(value: string): value is Role {
  return (Object.values(ROLE) as readonly string[]).includes(value);
}
