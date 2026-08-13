import { defaultLocale, locales } from '@/locales';

export default async function CheckoutFailPage(props: PageProps<'/checkout/[orderId]/fail'>) {
  const searchParams = await props.searchParams;
  const t = locales[defaultLocale];

  const code = firstParam(searchParams.code);
  const message = firstParam(searchParams.message);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">{t.checkout.fail.title}</h1>
      <dl className="flex flex-col gap-2 rounded-lg border border-border p-4 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t.checkout.fail.codeLabel}</dt>
          <dd>{code}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t.checkout.fail.messageLabel}</dt>
          <dd className="break-all">{message}</dd>
        </div>
      </dl>
    </main>
  );
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}
