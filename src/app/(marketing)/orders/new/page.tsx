import { redirect } from 'next/navigation';

import { PageSection } from '@/components/page-section';
import { ROLE } from '@/constants/roles';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { getMockSessionRole } from '@/lib/mock/mock-session';
import { locales } from '@/locales';

import { NewOrderWizard } from './new-order-wizard';

export default async function NewOrderPage() {
  const role = await getMockSessionRole();
  if (role !== ROLE.CONSUMER) {
    redirect(CONSUMER_ROUTES.LOGIN);
  }

  const locale = await getLocale();
  const t = locales[locale];

  return (
    <PageSection className="flex flex-col gap-8 py-10">
      <div className="flex items-center justify-between border-b border-border pb-6">
        <h1 className="font-heading text-4xl font-bold text-foreground">
          {t.consumer.orderNew.title}
        </h1>
        <div className="flex items-center gap-6 text-sm">
          {[
            { step: 1, label: t.consumer.orderNew.steps.product },
            { step: 2, label: t.consumer.orderNew.steps.upload },
            { step: 3, label: t.consumer.orderNew.steps.details },
            { step: 4, label: t.consumer.orderNew.steps.confirm },
          ].map((item) => (
            <div key={item.step} className="flex items-center gap-2">
              <span
                className={`flex size-6 items-center justify-center rounded-full text-xs font-bold ${
                  item.step === 1
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                {item.step}
              </span>
              <span
                className={
                  item.step === 1 ? 'font-semibold text-foreground' : 'text-muted-foreground'
                }
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <NewOrderWizard />
    </PageSection>
  );
}
