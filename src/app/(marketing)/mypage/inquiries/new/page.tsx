import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

import { InquiryForm } from './inquiry-form';

export default async function MypageNewInquiryPage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 flex-col gap-8 px-10 py-10">
      <h1 className="font-heading text-4xl font-bold text-foreground">
        {t.consumer.inquiries.newTitle}
      </h1>
      <InquiryForm />
    </div>
  );
}
