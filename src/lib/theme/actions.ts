'use server';

import { cookies } from 'next/headers';

import { THEME_COOKIE_MAX_AGE, THEME_COOKIE_NAME, type Theme } from '@/constants/theme';
import { createServerSupabaseClient } from '@/lib/supabase/server-client';

export async function setTheme(theme: Theme) {
  const cookieStore = await cookies();
  cookieStore.set(THEME_COOKIE_NAME, theme, {
    maxAge: THEME_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  });

  await persistThemeToProfile(theme);
}

async function persistThemeToProfile(theme: Theme) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    await supabase.auth.updateUser({ data: { theme } });
  } catch {
    // best-effort persistence; the theme cookie already drives server rendering
    // and the next theme change retries the profile write
  }
}
