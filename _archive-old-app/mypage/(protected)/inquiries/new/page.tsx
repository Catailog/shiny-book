import { Card, CardContent } from '@/components/ui/card';
import { defaultLocale, locales } from '@/locales';

import { InquiryForm } from './inquiry-form';

export default function NewInquiryPage() {
  const t = locales[defaultLocale];

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.consumer.inquiries.newTitle}</h1>
      <Card className="max-w-md">
        <CardContent>
          <InquiryForm />
        </CardContent>
      </Card>
    </div>
  );
}
