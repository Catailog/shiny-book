import { notFound } from 'next/navigation';

import { ORDER_STATUS } from '@/constants/order-status';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { defaultLocale, locales } from '@/locales';

import { CheckoutWidget } from './checkout-widget';

export default async function CheckoutPage(props: PageProps<'/checkout/[orderId]'>) {
  const { orderId } = await props.params;
  const order = await getOrderById(orderId);
  const t = locales[defaultLocale];

  if (!order) {
    notFound();
  }

  if (order.status !== ORDER_STATUS.AWAITING_PAYMENT) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-lg font-medium text-foreground">{t.checkout.alreadyProcessed}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">{t.checkout.title}</h1>
      <div className="flex flex-col gap-2 rounded-lg border border-border p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-foreground">{order.title}</span>
          <span className="text-muted-foreground">
            {order.quantity}
            {t.checkout.quantitySuffix}
          </span>
        </div>
        <div className="flex justify-between font-medium">
          <span>{t.checkout.amountLabel}</span>
          <span>{order.amount.toLocaleString()}</span>
        </div>
      </div>
      <CheckoutWidget orderId={order.id} orderName={order.title} amount={order.amount} />
    </main>
  );
}
