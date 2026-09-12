import type { CSSProperties, ReactNode } from 'react';

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';

import type { OrderNotifyStatus } from '@/constants/email';
import { type Locale, locales } from '@/locales';

// Email clients ignore <style>/class-based CSS inconsistently, so react-email
// templates use inline style objects. This is the documented exception to the
// project's "no inline style" rule.

export function OrderStatusChangedEmail({
  locale,
  customerName,
  orderNumber,
  status,
  orderUrl,
}: OrderStatusChangedEmailProps) {
  const t = locales[locale].email.orderStatusChanged;

  return (
    <Html lang={locale}>
      <Head />
      <Preview>{t.subject[status]}</Preview>
      <EmailShell>
        <Heading style={heading}>{t.heading[status]}</Heading>
        <Text style={paragraph}>
          {t.greetingPrefix}
          {customerName}
          {t.greetingSuffix}
        </Text>
        <Text style={paragraph}>{t.body[status]}</Text>
        <Text style={meta}>
          {t.orderNumberLabel}: {orderNumber}
        </Text>
        <Section style={ctaSection}>
          <Button href={orderUrl} style={button}>
            {t.ctaLabel}
          </Button>
        </Section>
        <Hr style={divider} />
        <Text style={footer}>{t.footerNote}</Text>
        <Text style={footer}>{t.signOff}</Text>
      </EmailShell>
    </Html>
  );
}

export default OrderStatusChangedEmail;

OrderStatusChangedEmail.PreviewProps = {
  locale: 'ko',
  customerName: '홍길동',
  orderNumber: 'SB-20260904-0001',
  status: 'shipping',
  orderUrl: 'http://localhost:3000/mypage/orders/preview',
} satisfies OrderStatusChangedEmailProps;

function EmailShell({ children }: { children: ReactNode }) {
  return (
    <Body style={body}>
      <Container style={container}>{children}</Container>
    </Body>
  );
}

const body: CSSProperties = {
  backgroundColor: '#f4f4f5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  margin: 0,
  padding: '24px 0',
};

const container: CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #e4e4e7',
  borderRadius: '12px',
  margin: '0 auto',
  maxWidth: '480px',
  padding: '32px',
};

const heading: CSSProperties = {
  color: '#18181b',
  fontSize: '20px',
  fontWeight: 700,
  margin: '0 0 16px',
};

const paragraph: CSSProperties = {
  color: '#3f3f46',
  fontSize: '14px',
  lineHeight: '22px',
  margin: '0 0 12px',
};

const meta: CSSProperties = {
  color: '#71717a',
  fontSize: '13px',
  margin: '16px 0 0',
};

const ctaSection: CSSProperties = {
  margin: '24px 0 8px',
};

const button: CSSProperties = {
  backgroundColor: '#18181b',
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '14px',
  fontWeight: 600,
  padding: '12px 20px',
  textDecoration: 'none',
};

const divider: CSSProperties = {
  borderColor: '#e4e4e7',
  margin: '24px 0 16px',
};

const footer: CSSProperties = {
  color: '#a1a1aa',
  fontSize: '12px',
  lineHeight: '18px',
  margin: '0 0 4px',
};

interface OrderStatusChangedEmailProps {
  locale: Locale;
  customerName: string;
  orderNumber: string;
  status: OrderNotifyStatus;
  orderUrl: string;
}
