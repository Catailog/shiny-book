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
import { TOSS_ERROR_CODES, getTossErrorCode } from '@/constants/toss-error-codes';
import { env } from '@/env';
import { useT } from '@/hooks/use-t';

interface CheckoutWidgetProps {
  orderId: string;
  orderName: string;
  amount: number;
}

interface PaymentNotice {
  kind: 'error' | 'cancelled';
  message: string;
}

export function CheckoutWidget({ orderId, orderName, amount }: CheckoutWidgetProps) {
  const t = useT();
  const widgetsRef = useRef<TossPaymentsWidgets | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState<PaymentNotice | null>(null);

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

    setPaymentNotice(null);
    try {
      await widgets.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/checkout/${orderId}/success`,
        failUrl: `${window.location.origin}/checkout/${orderId}/fail`,
      });
    } catch (error) {
      if (getTossErrorCode(error) === TOSS_ERROR_CODES.USER_CANCEL) {
        setPaymentNotice({ kind: 'cancelled', message: t.checkout.payCancelled });
        return;
      }

      setPaymentNotice({ kind: 'error', message: t.checkout.payError });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div id="toss-payment-methods" />
      <div id="toss-agreement" />
      {paymentNotice ? (
        <p
          className={
            paymentNotice.kind === 'error'
              ? 'text-sm text-destructive'
              : 'text-sm text-muted-foreground'
          }
        >
          {paymentNotice.message}
        </p>
      ) : null}
      <Button onClick={handlePayClick} disabled={!isReady} className="w-full">
        {t.checkout.payButton}
      </Button>
    </div>
  );
}
