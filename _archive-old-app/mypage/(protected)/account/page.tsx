import { Card, CardContent } from '@/components/ui/card';
import { defaultLocale, locales } from '@/locales';

import { ConsumerAccountForm } from './account-form';

export default function ConsumerAccountPage() {
  const t = locales[defaultLocale];

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{t.consumer.account.title}</h1>
      <Card className="max-w-sm">
        <CardContent>
          <ConsumerAccountForm />
        </CardContent>
      </Card>
    </div>
  );
}
