import { headers } from 'next/headers';

import 'server-only';

import { parseClientIp } from '@/lib/request/parse-client-ip';

export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  return parseClientIp(headerList.get('x-forwarded-for'), headerList.get('x-real-ip'));
}
