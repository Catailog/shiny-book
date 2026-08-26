import { headers } from 'next/headers';

import 'server-only';

export async function getClientIp(): Promise<string> {
  const headerList = await headers();
  const forwardedFor = headerList.get('x-forwarded-for');
  if (forwardedFor) {
    return (forwardedFor.split(',')[0] ?? forwardedFor).trim();
  }

  return headerList.get('x-real-ip') ?? 'unknown';
}
