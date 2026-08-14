import { defaultLocale, locales } from '@/locales';

import { InquiryForm } from './inquiry-form';

export default function NewInquiryPage() {
  const t = locales[defaultLocale];

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">{t.consumer.inquiries.newTitle}</h1>
      <InquiryForm />
    </main>
  );
}
