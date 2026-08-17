import { notFound, redirect } from 'next/navigation';

import { PageSection } from '@/components/page-section';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getLocale } from '@/lib/i18n/get-locale';
import { getProducts } from '@/lib/products/get-products';
import { locales } from '@/locales';

import { NewOrderWizard } from './new-order-wizard';

export default async function NewOrderPage(props: PageProps<'/orders/new'>) {
  const consumer = await getCurrentConsumer();
  if (!consumer) {
    redirect(
      `${CONSUMER_ROUTES.LOGIN}?redirectTo=${encodeURIComponent(CONSUMER_ROUTES.NEW_ORDER)}`,
    );
  }

  const searchParams = await props.searchParams;
  const slug = firstParam(searchParams.product);

  const locale = await getLocale();
  const t = locales[locale];
  const products = await getProducts();
  const product = (slug ? products.find((item) => item.slug === slug) : products[0]) ?? null;

  if (!product) {
    notFound();
  }

  return (
    <PageSection className="flex flex-col gap-8 py-10">
      <div className="border-b border-border pb-6">
        <h1 className="font-heading text-4xl font-bold text-foreground">
          {t.consumer.orderNew.title}
        </h1>
      </div>

      <NewOrderWizard product={product} />
    </PageSection>
  );
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}
