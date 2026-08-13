export const TOSS_ERROR_CODES = {
  PAY_PROCESS_CANCELED: 'PAY_PROCESS_CANCELED',
  USER_CANCEL: 'USER_CANCEL',
} as const;

export function getTossErrorCode(error: unknown): string | null {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return null;
  }

  const { code } = error as Record<string, unknown>;
  return typeof code === 'string' ? code : null;
}
