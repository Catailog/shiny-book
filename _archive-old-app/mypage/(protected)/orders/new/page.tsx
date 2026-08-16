import { Card, CardContent } from '@/components/ui/card';
import { defaultLocale, locales } from '@/locales';

import { ConsumerOrderForm } from './order-form';

export default function NewConsumerOrderPage() {
  const t = locales[defaultLocale];

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.consumer.orderNew.title}</h1>
      <Card className="max-w-md">
        <CardContent>
          <ConsumerOrderForm />
        </CardContent>
      </Card>
    </div>
  );
}
