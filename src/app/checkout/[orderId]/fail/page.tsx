import { TOSS_ERROR_CODES } from '@/constants/toss-error-codes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

export default async function CheckoutFailPage(props: PageProps<'/checkout/[orderId]/fail'>) {
  const searchParams = await props.searchParams;
  const locale = await getLocale();
  const t = locales[locale];

  const code = firstParam(searchParams.code);
  const message = firstParam(searchParams.message);

  const knownFailures: Record<string, { title: string; description: string }> = {
    [TOSS_ERROR_CODES.PAY_PROCESS_CANCELED]: {
      title: t.checkout.fail.cancelledTitle,
      description: t.checkout.fail.cancelledDescription,
    },
    [TOSS_ERROR_CODES.PAY_PROCESS_ABORTED]: {
      title: t.checkout.fail.abortedTitle,
      description: t.checkout.fail.abortedDescription,
    },
    [TOSS_ERROR_CODES.REJECT_CARD_COMPANY]: {
      title: t.checkout.fail.rejectedTitle,
      description: t.checkout.fail.rejectedDescription,
    },
  };

  const knownFailure = knownFailures[code];

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">
        {knownFailure?.title ?? t.checkout.fail.title}
      </h1>
      {knownFailure ? (
        <p className="text-sm text-muted-foreground">{knownFailure.description}</p>
      ) : null}
      <dl className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 text-sm shadow-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t.checkout.fail.codeLabel}</dt>
          <dd>{code}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">{t.checkout.fail.messageLabel}</dt>
          <dd className="break-all">{message}</dd>
        </div>
      </dl>
    </div>
  );
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}
