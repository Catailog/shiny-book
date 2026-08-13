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
  const [isRequesting, setIsRequesting] = useState(false);
  const [hasAgreedRequiredTerms, setHasAgreedRequiredTerms] = useState(true);
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

      agreementWidget.on('agreementStatusChange', (status) => {
        setHasAgreedRequiredTerms(status.agreedRequiredTerms);
      });

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
    if (!widgets || isRequesting) {
      return;
    }

    setPaymentNotice(null);

    if (!hasAgreedRequiredTerms) {
      setPaymentNotice({ kind: 'error', message: t.checkout.needAgreement });
      return;
    }

    setIsRequesting(true);
    try {
      await widgets.requestPayment({
        orderId,
        orderName,
        successUrl: `${window.location.origin}/checkout/${orderId}/success`,
        failUrl: `${window.location.origin}/checkout/${orderId}/fail`,
      });
    } catch (error) {
      const code = getTossErrorCode(error);

      if (code === TOSS_ERROR_CODES.USER_CANCEL) {
        setPaymentNotice({ kind: 'cancelled', message: t.checkout.payCancelled });
        return;
      }

      const knownErrorMessages: Record<string, string> = {
        [TOSS_ERROR_CODES.NOT_SELECTED_PAYMENT_METHOD]:
          t.checkout.paymentErrors.notSelectedPaymentMethod,
        [TOSS_ERROR_CODES.NEED_AGREEMENT_WITH_REQUIRED_TERMS]: t.checkout.needAgreement,
        [TOSS_ERROR_CODES.NEED_CARD_PAYMENT_DETAIL]: t.checkout.paymentErrors.needCardPaymentDetail,
        [TOSS_ERROR_CODES.NEED_REFUND_ACCOUNT_DETAIL]:
          t.checkout.paymentErrors.needRefundAccountDetail,
        [TOSS_ERROR_CODES.EXCEED_DEPOSIT_AMOUNT_LIMIT]:
          t.checkout.paymentErrors.exceedDepositAmountLimit,
        [TOSS_ERROR_CODES.PROVIDER_STATUS_UNHEALTHY]:
          t.checkout.paymentErrors.providerStatusUnhealthy,
        [TOSS_ERROR_CODES.UNSUPPORTED_TEST_PHASE_PAYMENT_METHOD]:
          t.checkout.paymentErrors.unsupportedTestPhasePaymentMethod,
        [TOSS_ERROR_CODES.NETWORK_ERROR]: t.checkout.paymentErrors.networkError,
        [TOSS_ERROR_CODES.INVALID_METHOD_TRANSACTION]:
          t.checkout.paymentErrors.invalidMethodTransaction,
      };

      setPaymentNotice({
        kind: 'error',
        message: (code && knownErrorMessages[code]) || t.checkout.payError,
      });
    } finally {
      setIsRequesting(false);
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
      <Button onClick={handlePayClick} disabled={!isReady || isRequesting} className="w-full">
        {t.checkout.payButton}
      </Button>
    </div>
  );
}
