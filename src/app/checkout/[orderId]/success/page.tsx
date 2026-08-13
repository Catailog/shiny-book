import { defaultLocale, locales } from '@/locales';

export default async function CheckoutSuccessPage(props: PageProps<'/checkout/[orderId]/success'>) {
  const searchParams = await props.searchParams;
  const t = locales[defaultLocale];

  const paymentKey = firstParam(searchParams.paymentKey);
  const orderId = firstParam(searchParams.orderId);
  const amount = firstParam(searchParams.amount);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">{t.checkout.success.title}</h1>
      <p className="text-sm text-muted-foreground">{t.checkout.success.description}</p>
      <dl className="flex flex-col gap-2 rounded-lg border border-border p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t.checkout.success.orderIdLabel}</dt>
          <dd>{orderId}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t.checkout.success.amountLabel}</dt>
          <dd>{amount}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t.checkout.success.paymentKeyLabel}</dt>
          <dd className="break-all">{paymentKey}</dd>
        </div>
      </dl>
    </main>
  );
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}
