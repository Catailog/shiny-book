import { defaultLocale, locales } from '@/locales';

import { ConsumerOrderForm } from './order-form';

export default function NewConsumerOrderPage() {
  const t = locales[defaultLocale];

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">{t.consumer.orderNew.title}</h1>
      <ConsumerOrderForm />
    </main>
  );
}
