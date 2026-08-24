import { notFound, redirect } from 'next/navigation';

import { PageSection } from '@/components/page-section';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getAddressesByConsumer } from '@/lib/addresses/get-addresses-by-consumer';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getLocale } from '@/lib/i18n/get-locale';
import { getOrderEditPrefill } from '@/lib/orders/get-order-edit-prefill';
import { getProducts } from '@/lib/products/get-products';
import { resolveProductName } from '@/lib/products/resolve-product-name';
import { locales } from '@/locales';

import { MarkOrderCtaSeenOnMount } from './mark-order-cta-seen-on-mount';
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
  const fromOrderId = firstParam(searchParams.fromOrder);

  const locale = await getLocale();
  const t = locales[locale];
  const [products, addresses, editPrefill] = await Promise.all([
    getProducts(),
    getAddressesByConsumer(consumer.id),
    fromOrderId ? getOrderEditPrefill(fromOrderId, consumer.id) : null,
  ]);
  const product =
    (editPrefill
      ? products.find((item) => item.id === editPrefill.productId)
      : slug
        ? products.find((item) => item.slug === slug)
        : products[0]) ?? null;

  if (!product) {
    notFound();
  }

  return (
    <PageSection className="flex flex-col gap-8 py-10">
      <MarkOrderCtaSeenOnMount />
      <div className="border-b border-border pb-6">
        <h1 className="font-heading text-4xl font-bold text-foreground">
          {t.consumer.orderNew.title}
        </h1>
      </div>

      <NewOrderWizard
        product={{ ...product, name: resolveProductName(product, locale) }}
        addresses={addresses}
        allowTestUpload
        initialValues={editPrefill}
      />
    </PageSection>
  );
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}
