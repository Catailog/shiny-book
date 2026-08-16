import { ROLE } from '@/constants/roles';

export interface MockAccount {
  id: string;
  name: string;
  email: string;
}

export const MOCK_CONSUMER: MockAccount = {
  id: 'mock-consumer-1',
  name: '김도현',
  email: 'dohyun@studio.com',
};

export const MOCK_ADMIN: MockAccount = {
  id: 'mock-admin-1',
  name: 'Sarah Jenkins',
  email: 'sarah@bookcraft.studio',
};

export const MOCK_ACCOUNTS = {
  [ROLE.CONSUMER]: MOCK_CONSUMER,
  [ROLE.ADMIN]: MOCK_ADMIN,
} as const;
