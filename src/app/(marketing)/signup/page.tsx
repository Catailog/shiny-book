import { redirect } from 'next/navigation';

import { BookOpen } from 'lucide-react';

import { ROLE } from '@/constants/roles';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { getMockSessionRole } from '@/lib/mock/mock-session';
import { locales } from '@/locales';

import { SignupForm } from './signup-form';

export default async function SignupPage() {
  const role = await getMockSessionRole();
  if (role === ROLE.CONSUMER) {
    redirect(CONSUMER_ROUTES.MYPAGE);
  }

  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 items-center justify-center bg-muted px-4 py-16">
      <div className="flex w-full max-w-120 flex-col gap-8 rounded-xl border border-border bg-card p-10 shadow-lg">
        <div className="flex flex-col items-center gap-3 text-center">
          <BookOpen aria-hidden="true" className="size-8 text-foreground" />
          <div>
            <h1 className="font-heading text-3xl font-bold text-foreground">
              {t.consumer.signup.title}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{t.consumer.signup.subtitle}</p>
          </div>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
