import { NextResponse } from 'next/server';

import { timingSafeEqual } from 'node:crypto';

import { ROLE } from '@/constants/roles';
import { TEST_ACCOUNT } from '@/constants/test-account';
import { env } from '@/env';
import { withRequestContext } from '@/lib/api/with-request-context';
import { deleteConsumerAndData } from '@/lib/consumers/delete-consumer-and-data';
import { createServiceRoleClient } from '@/lib/supabase/service-role';

const INACTIVE_DAYS_THRESHOLD = 7;
const LIST_USERS_PAGE_SIZE = 1000;

interface TestAccountEntry {
  id: string;
  role: string | undefined;
  lastActiveAt: string;
}

function isRequestAuthorized(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return false;
  }

  const expected = Buffer.from(`Bearer ${env.CRON_SECRET}`);
  const actual = Buffer.from(authHeader);
  if (expected.length !== actual.length) {
    return false;
  }

  return timingSafeEqual(expected, actual);
}

async function getHandler(request: Request): Promise<NextResponse> {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const supabase = createServiceRoleClient();
  const groups = new Map<string, TestAccountEntry[]>();

  let page = 1;
  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: LIST_USERS_PAGE_SIZE,
    });

    if (error) {
      return NextResponse.json({ error: 'list_users_failed' }, { status: 500 });
    }

    for (const user of data.users) {
      if (user.app_metadata[TEST_ACCOUNT.IS_TEST_ACCOUNT_METADATA_KEY] !== true) {
        continue;
      }

      const pairToken = user.app_metadata[TEST_ACCOUNT.PAIR_TOKEN_METADATA_KEY];
      const groupKey = typeof pairToken === 'string' ? pairToken : user.id;
      const entry: TestAccountEntry = {
        id: user.id,
        role: typeof user.app_metadata.role === 'string' ? user.app_metadata.role : undefined,
        lastActiveAt: user.last_sign_in_at ?? user.created_at,
      };

      const group = groups.get(groupKey);
      if (group) {
        group.push(entry);
      } else {
        groups.set(groupKey, [entry]);
      }
    }

    if (data.users.length < LIST_USERS_PAGE_SIZE) {
      break;
    }
    page += 1;
  }

  const thresholdMs = INACTIVE_DAYS_THRESHOLD * 24 * 60 * 60 * 1000;
  const now = Date.now();

  let deletedGroups = 0;
  let deletedAccounts = 0;

  for (const entries of groups.values()) {
    const mostRecentActivity = Math.max(
      ...entries.map((entry) => new Date(entry.lastActiveAt).getTime()),
    );

    if (now - mostRecentActivity < thresholdMs) {
      continue;
    }

    let allDeleted = true;

    for (const entry of entries) {
      let isDeleted: boolean;
      if (entry.role === ROLE.ADMIN) {
        const { error } = await supabase.auth.admin.deleteUser(entry.id);
        isDeleted = !error;
      } else {
        isDeleted = await deleteConsumerAndData(entry.id);
      }

      if (isDeleted) {
        deletedAccounts += 1;
      } else {
        allDeleted = false;
      }
    }

    if (allDeleted) {
      deletedGroups += 1;
    }
  }

  return NextResponse.json({ checkedGroups: groups.size, deletedGroups, deletedAccounts });
}

export const GET = withRequestContext(getHandler);
