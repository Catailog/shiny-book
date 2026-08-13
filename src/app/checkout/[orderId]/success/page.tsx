import type { ReactNode } from 'react';

import { finalizeOrderPayment } from '@/lib/orders/finalize-order-payment';
import { defaultLocale, locales } from '@/locales';

export default async function CheckoutSuccessPage(props: PageProps<'/checkout/[orderId]/success'>) {
  const { orderId } = await props.params;
  const searchParams = await props.searchParams;
  const t = locales[defaultLocale];

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
    const copy =
      result.outcome === 'confirmed'
        ? t.checkout.confirm.confirmed
        : t.checkout.confirm.alreadyProcessed;

    return (
      <ResultCard title={copy.title} description={copy.description}>
        <dl className="flex flex-col gap-2 rounded-lg border border-border p-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t.checkout.orderIdLabel}</dt>
            <dd>{result.order.id}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">{t.checkout.amountLabel}</dt>
            <dd>{result.order.amount.toLocaleString()}</dd>
          </div>
        </dl>
      </ResultCard>
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

function ResultCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
      {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      {children}
    </main>
  );
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}
