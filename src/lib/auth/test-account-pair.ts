import 'server-only';

import { ROLE } from '@/constants/roles';
import { TEST_ACCOUNT, TEST_ACCOUNT_ROLE_PREFIX } from '@/constants/test-account';
import { seedTestConsumerData } from '@/lib/auth/seed-test-consumer-data';
import {
  buildTestAccountEmail,
  generateTestAccountPairToken,
  generateTestAccountPassword,
  persistTestAccountPairToken,
} from '@/lib/auth/test-account-session';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

export interface TestAccountPairCredentials {
  consumerEmail: string;
  consumerPassword: string;
  adminEmail: string;
  adminPassword: string;
}

export async function createTestAccountPair(): Promise<TestAccountPairCredentials | null> {
  const token = generateTestAccountPairToken();
  const consumerEmail = buildTestAccountEmail(TEST_ACCOUNT_ROLE_PREFIX.CONSUMER, token);
  const consumerPassword = generateTestAccountPassword();
  const adminEmail = buildTestAccountEmail(TEST_ACCOUNT_ROLE_PREFIX.ADMIN, token);
  const adminPassword = generateTestAccountPassword();
  const serviceClient = createServiceRoleClient();

  const { data: adminUser, error: adminError } = await serviceClient.auth.admin.createUser({
    email: adminEmail,
    password: adminPassword,
    email_confirm: true,
    app_metadata: {
      role: ROLE.ADMIN,
      [TEST_ACCOUNT.IS_TEST_ACCOUNT_METADATA_KEY]: true,
      [TEST_ACCOUNT.PAIR_TOKEN_METADATA_KEY]: token,
    },
    user_metadata: { display_name: '테스트 관리자' },
  });

  if (adminError || !adminUser.user) {
    return null;
  }

  const { data: consumerUser, error: consumerError } = await serviceClient.auth.admin.createUser({
    email: consumerEmail,
    password: consumerPassword,
    email_confirm: true,
    app_metadata: {
      [TEST_ACCOUNT.IS_TEST_ACCOUNT_METADATA_KEY]: true,
      [TEST_ACCOUNT.PAIR_TOKEN_METADATA_KEY]: token,
    },
    user_metadata: { display_name: '테스트 사용자' },
  });

  if (consumerError || !consumerUser.user) {
    return null;
  }

  await persistTestAccountPairToken(token);
  await seedTestConsumerData(consumerUser.user.id, adminUser.user.id);

  return { consumerEmail, consumerPassword, adminEmail, adminPassword };
}
