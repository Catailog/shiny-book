import { type NextRequest, NextResponse } from 'next/server';

import { createServerClient } from '@supabase/ssr';

import { ADMIN_ROUTES, CONSUMER_ROUTES } from '@/constants/routes';
import { env } from '@/env';
import { isAdminRole } from '@/lib/auth/is-admin-role';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticatedAdmin = user !== null && isAdminRole(user.app_metadata.role);
  const isAuthenticatedConsumer = user !== null && !isAdminRole(user.app_metadata.role);

  const { pathname } = request.nextUrl;
  const isAdminLoginRoute = pathname === ADMIN_ROUTES.LOGIN;
  const isAdminRoute = pathname.startsWith(ADMIN_ROUTES.DASHBOARD);

  if (isAdminRoute && !isAdminLoginRoute && !isAuthenticatedAdmin) {
    return NextResponse.redirect(new URL(ADMIN_ROUTES.LOGIN, request.url));
  }

  if (isAdminLoginRoute && isAuthenticatedAdmin) {
    return NextResponse.redirect(new URL(ADMIN_ROUTES.DASHBOARD, request.url));
  }

  const isConsumerAuthRoute =
    pathname === CONSUMER_ROUTES.LOGIN || pathname === CONSUMER_ROUTES.SIGNUP;
  const isMypageRoute =
    pathname.startsWith(CONSUMER_ROUTES.MYPAGE) || pathname.startsWith(CONSUMER_ROUTES.NEW_ORDER);

  if (isMypageRoute && !isAuthenticatedConsumer) {
    return NextResponse.redirect(new URL(CONSUMER_ROUTES.LOGIN, request.url));
  }

  if (isConsumerAuthRoute && isAuthenticatedConsumer) {
    return NextResponse.redirect(new URL(CONSUMER_ROUTES.MYPAGE, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)'],
};
