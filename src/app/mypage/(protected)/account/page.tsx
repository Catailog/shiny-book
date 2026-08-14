import { defaultLocale, locales } from '@/locales';

import { ConsumerAccountForm } from './account-form';

export default function ConsumerAccountPage() {
  const t = locales[defaultLocale];

  return (
    <main className="mx-auto flex w-full max-w-sm flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">{t.consumer.account.title}</h1>
      <ConsumerAccountForm />
    </main>
  );
}
