import type { Locale } from '@/locales';

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = 60 * 60;
const SECONDS_PER_DAY = 24 * 60 * 60;
const RELATIVE_DATE_MAX_DAYS = 7;

export function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

export function formatDateTime(isoString: string): string {
  const date = new Date(isoString);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${formatDate(isoString)} ${hours}:${minutes}:${seconds}`;
}

export function formatRelativeDate(isoString: string, locale: Locale, now = new Date()): string {
  const date = new Date(isoString);
  const diffSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000));

  if (diffSeconds < SECONDS_PER_MINUTE) {
    const seconds = Math.max(1, diffSeconds);
    return locale === 'ko' ? `${seconds}초 전` : `${seconds}s ago`;
  }
  if (diffSeconds < SECONDS_PER_HOUR) {
    const minutes = Math.floor(diffSeconds / SECONDS_PER_MINUTE);
    return locale === 'ko' ? `${minutes}분 전` : `${minutes}m ago`;
  }
  if (diffSeconds < SECONDS_PER_DAY) {
    const hours = Math.floor(diffSeconds / SECONDS_PER_HOUR);
    return locale === 'ko' ? `${hours}시간 전` : `${hours}h ago`;
  }

  const days = Math.floor(diffSeconds / SECONDS_PER_DAY);
  if (days <= RELATIVE_DATE_MAX_DAYS) {
    return locale === 'ko' ? `${days}일 전` : `${days}d ago`;
  }

  return formatDate(isoString);
}
