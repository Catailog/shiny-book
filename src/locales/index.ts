import { en } from '@/locales/en';
import { ko } from '@/locales/ko';

export const locales = { ko, en } as const;
export type Locale = keyof typeof locales;
export const defaultLocale: Locale = 'ko';
