'use client';

import { useEffect, useRef, useState } from 'react';

import {
  ANONYMOUS,
  type TossPaymentsWidgets,
  type WidgetAgreementWidget,
  type WidgetPaymentMethodWidget,
  loadTossPayments,
} from '@tosspayments/tosspayments-sdk';

import { Button } from '@/components/ui/button';
import { env } from '@/env';
import { useT } from '@/hooks/use-t';

interface CheckoutWidgetProps {
  orderId: string;
  orderName: string;
  amount: number;
}

export function CheckoutWidget({ orderId, orderName, amount }: CheckoutWidgetProps) {
  const t = useT();
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    let isCancelled = false;
    let paymentMethodWidget: WidgetPaymentMethodWidget | null = null;
    let agreementWidget: WidgetAgreementWidget | null = null;

    async function setupWidgets() {
      const tossPayments = await loadTossPayments(env.NEXT_PUBLIC_TOSS_CLIENT_KEY);
      if (isCancelled) {
        return;
      }

      const widgets = tossPayments.widgets({ customerKey: ANONYMOUS });
      await widgets.setAmount({ currency: 'KRW', value: amount });
      if (isCancelled) {
        return;
      }

      [paymentMethodWidget, agreementWidget] = await Promise.all([
        widgets.renderPaymentMethods({ selector: '#toss-payment-methods' }),
        widgets.renderAgreement({ selector: '#toss-agreement' }),
      ]);

      if (isCancelled) {
        await Promise.all([paymentMethodWidget.destroy(), agreementWidget.destroy()]);
        return;
      }

      widgetsRef.current = widgets;
      setIsReady(true);
    }

    void setupWidgets();

    return () => {
      isCancelled = true;
      void paymentMethodWidget?.destroy();
      void agreementWidget?.destroy();
    };
  }, [amount]);

  async function handlePayClick() {
    const widgets = widgetsRef.current;
    if (!widgets) {
      return;
    }

    setPayError(null);
    try {
      await widgets.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/checkout/${orderId}/success`,
        failUrl: `${window.location.origin}/checkout/${orderId}/fail`,
      });
    } catch {
      setPayError(t.checkout.payError);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div id="toss-payment-methods" />
      <div id="toss-agreement" />
      {payError ? <p className="text-sm text-destructive">{payError}</p> : null}
      <Button onClick={handlePayClick} disabled={!isReady} className="w-full">
        {t.checkout.payButton}
      </Button>
    </div>
  );
}
