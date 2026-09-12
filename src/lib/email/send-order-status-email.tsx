import { resolveMx } from 'node:dns/promises';
import 'server-only';

import {
  EMAIL_BLOCKED_RECIPIENT_DOMAINS,
  EMAIL_SENDER,
  buildOrderDetailUrl,
  isOrderNotifyStatus,
} from '@/constants/email';
import { isLocale } from '@/constants/locale';
import type { OrderStatus } from '@/constants/order-status';
import { OrderStatusChangedEmail } from '@/emails/order-status-changed';
import { env } from '@/env';
import type { Tables } from '@/lib/db/database.types';
import { getResendClient } from '@/lib/email/client';
import { shouldNotifyOrderStatusChange } from '@/lib/email/should-notify-order-status-change';
import { formatIdPrefix } from '@/lib/format-id-prefix';
import { logger } from '@/lib/log/logger';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { type Locale, defaultLocale, locales } from '@/locales';

export interface SendOrderStatusEmailInput {
  order: Pick<Tables<'orders'>, 'id' | 'consumer_id'>;
  fromStatus: OrderStatus | null;
  toStatus: OrderStatus;
  isRevert?: boolean;
}

export async function sendOrderStatusEmail({
  order,
  fromStatus,
  toStatus,
  isRevert = false,
}: SendOrderStatusEmailInput): Promise<void> {
  const logContext = { orderId: order.id, toStatus, isRevert };

  try {
    if (!shouldNotifyOrderStatusChange({ fromStatus, toStatus, isRevert })) {
      return;
    }

    if (!isOrderNotifyStatus(toStatus)) {
      return;
    }

    if (!order.consumer_id) {
      logger.info(logContext, 'order status email skipped: order has no consumer');
      return;
    }

    const { data, error } = await createServiceRoleClient().auth.admin.getUserById(
      order.consumer_id,
    );
    const recipient = data?.user;
    if (error || !recipient?.email) {
      logger.warn(logContext, 'order status email skipped: consumer lookup failed');
      return;
    }

    if (recipient.user_metadata.orderStatusEmailConsent === false) {
      logger.info(logContext, 'order status email skipped: consumer opted out');
      return;
    }

    const domain = recipient.email.split('@')[1]?.toLowerCase() ?? '';
    if (!domain || EMAIL_BLOCKED_RECIPIENT_DOMAINS.includes(domain)) {
      logger.info(
        { ...logContext, domain },
        'order status email skipped: blocked recipient domain',
      );
      return;
    }

    if (!(await hasMailHost(domain))) {
      logger.info({ ...logContext, domain }, 'order status email skipped: no MX record');
      return;
    }

    const localeValue = recipient.user_metadata.locale;
    const locale: Locale = isLocale(localeValue) ? localeValue : defaultLocale;
    const nameValue = recipient.user_metadata.name;
    const customerName = typeof nameValue === 'string' ? nameValue : '';

    const resend = getResendClient();
    if (!resend) {
      logger.info(
        { ...logContext, locale },
        'order status email: RESEND_API_KEY unset, would send',
      );
      return;
    }

    const { error: sendError } = await resend.emails.send({
      from: EMAIL_SENDER,
      to: recipient.email,
      subject: locales[locale].email.orderStatusChanged.subject[toStatus],
      react: (
        <OrderStatusChangedEmail
          locale={locale}
          customerName={customerName}
          orderNumber={formatIdPrefix(order.id)}
          status={toStatus}
          orderUrl={buildOrderDetailUrl(env.APP_URL, order.id)}
        />
      ),
    });

    if (sendError) {
      logger.warn({ ...logContext, err: sendError.message }, 'order status email send failed');
      return;
    }

    logger.info({ ...logContext, locale }, 'order status email sent');
  } catch (error) {
    logger.warn(
      { ...logContext, err: error instanceof Error ? error.message : 'unknown' },
      'order status email errored',
    );
  }
}

async function hasMailHost(domain: string): Promise<boolean> {
  try {
    const records = await resolveMx(domain);
    return records.length > 0;
  } catch (error) {
    // Domain has no mail host at all -> skip. Any other failure (timeout,
    // SERVFAIL, network) is inconclusive, so let the send proceed.
    return !isNoMailHostError(error);
  }
}

function isNoMailHostError(error: unknown): boolean {
  if (!(error instanceof Error) || !('code' in error)) {
    return false;
  }

  return error.code === 'ENOTFOUND' || error.code === 'ENODATA';
}
