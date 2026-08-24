import type { ReactNode } from 'react';

import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Confetti } from '@/components/ui/confetti';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { formatCurrency } from '@/lib/format/currency';
import { getLocale } from '@/lib/i18n/get-locale';
import { finalizeOrderPayment } from '@/lib/orders/finalize-order-payment';
import { locales } from '@/locales';

export default async function CheckoutSuccessPage(props: PageProps<'/checkout/[orderId]/success'>) {
  const { orderId } = await props.params;
  const searchParams = await props.searchParams;
  const locale = await getLocale();
  const t = locales[locale];

  const paymentKey = firstParam(searchParams.paymentKey);
  const amountParam = firstParam(searchParams.amount);
  const amount = Number(amountParam);

  if (!paymentKey || amountParam === '' || !Number.isFinite(amount)) {
    return (
      <ResultCard
        title={t.checkout.confirm.invalidRequest.title}
        description={t.checkout.confirm.invalidRequest.description}
      />
    );
  }

  const result = await finalizeOrderPayment(orderId, paymentKey, amount);

  if (result.outcome === 'confirmed' || result.outcome === 'already_processed') {
    return (
      <>
        <Confetti className="pointer-events-none fixed inset-0 z-50 h-full w-full" />
        <ResultCard
          title={t.checkout.confirm.confirmed.title}
          description={t.checkout.confirm.confirmed.description}
        >
          <dl className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-sm shadow-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t.checkout.orderIdLabel}</dt>
              <dd>{result.order.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t.checkout.amountLabel}</dt>
              <dd>{formatCurrency(result.order.amount)}</dd>
            </div>
          </dl>
        </ResultCard>
      </>
    );
  }

  if (result.outcome === 'amount_mismatch') {
    return (
      <ResultCard
        title={t.checkout.confirm.amountMismatch.title}
        description={t.checkout.confirm.amountMismatch.description}
      />
    );
  }

  if (result.outcome === 'coupon_unavailable') {
    return (
      <ResultCard
        title={t.checkout.confirm.couponUnavailable.title}
        description={t.checkout.confirm.couponUnavailable.description}
      />
    );
  }

  if (result.outcome === 'confirm_failed') {
    return (
      <ResultCard
        title={t.checkout.confirm.confirmFailed.title}
        description={t.checkout.confirm.confirmFailed.description}
      />
    );
  }

  return (
    <ResultCard
      title={t.checkout.confirm.notFound.title}
      description={t.checkout.confirm.notFound.description}
    />
  );
}

async function ResultCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      {children}
      <Button
        render={<Link href={CONSUMER_ROUTES.MYPAGE} />}
        nativeButton={false}
        variant="primary"
        className="w-fit"
      >
        {t.checkout.backToMypageButton}
      </Button>
    </div>
  );
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}
