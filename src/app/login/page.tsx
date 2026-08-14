import { redirect } from 'next/navigation';

import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { defaultLocale, locales } from '@/locales';

import { ConsumerLoginForm } from './login-form';

export default async function ConsumerLoginPage() {
  const consumer = await getCurrentConsumer();
  if (consumer) {
    redirect(CONSUMER_ROUTES.MYPAGE);
  }

  const t = locales[defaultLocale];

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">{t.consumer.login.title}</h1>
      <ConsumerLoginForm />
    </main>
  );
}
