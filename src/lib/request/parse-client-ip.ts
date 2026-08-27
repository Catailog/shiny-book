export function parseClientIp(forwardedFor: string | null, realIp: string | null): string {
  if (forwardedFor) {
    return (forwardedFor.split(',')[0] ?? forwardedFor).trim();
  }

  return realIp ?? 'unknown';
}
