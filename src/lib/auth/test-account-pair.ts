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

const LIST_USERS_PAGE_SIZE = 1000;

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
    user_metadata: { display_name: `관리자 ${token}` },
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
    user_metadata: { display_name: `사용자 ${token}` },
  });

  if (consumerError || !consumerUser.user) {
    return null;
  }

  await persistTestAccountPairToken(token);
  await seedTestConsumerData(consumerUser.user.id, adminUser.user.id);

  return { consumerEmail, consumerPassword, adminEmail, adminPassword };
}

// Best-effort deletion of the admin account paired with a test consumer. Called when a
// test consumer deletes their own account so the paired admin is not left as an orphan
// until the cleanup cron catches it days later. Failures are swallowed on purpose: the
// consumer deletion has already succeeded and the cron is the backstop.
export async function deletePairedTestAdmin(pairToken: string): Promise<void> {
  const serviceClient = createServiceRoleClient();

  let page = 1;
  while (true) {
    const { data, error } = await serviceClient.auth.admin.listUsers({
      page,
      perPage: LIST_USERS_PAGE_SIZE,
    });
    if (error) {
      return;
    }

    const pairedAdmin = data.users.find(
      (user) =>
        user.app_metadata.role === ROLE.ADMIN &&
        user.app_metadata[TEST_ACCOUNT.IS_TEST_ACCOUNT_METADATA_KEY] === true &&
        user.app_metadata[TEST_ACCOUNT.PAIR_TOKEN_METADATA_KEY] === pairToken,
    );

    if (pairedAdmin) {
      await serviceClient.auth.admin.deleteUser(pairedAdmin.id);
      return;
    }

    if (data.users.length < LIST_USERS_PAGE_SIZE) {
      return;
    }
    page += 1;
  }
}
