export const THEME_COOKIE_NAME = 'theme';
export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const THEME_VALUES = ['light', 'dark'] as const;

export type Theme = (typeof THEME_VALUES)[number];

export function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && THEME_VALUES.some((theme) => theme === value);
}
