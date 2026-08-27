import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { DISCOUNT_TYPE } from '@/constants/coupon';
import { INQUIRY_MESSAGE_AUTHOR } from '@/constants/inquiry';
import { INQUIRY_CATEGORY } from '@/constants/inquiry-category';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { formatDate } from '@/lib/format-date';
import { formatIdPrefix } from '@/lib/format-id-prefix';
import { formatCurrency } from '@/lib/format/currency';
import { getLocale } from '@/lib/i18n/get-locale';
import { getInquiryById } from '@/lib/inquiries/get-inquiry-by-id';
import { getInquiryMessagesPage } from '@/lib/inquiries/get-inquiry-messages-page';
import { getInquiryOrderContext } from '@/lib/inquiries/get-inquiry-order-context';
import { locales } from '@/locales';

import { InquiryMessageThread } from './message-thread';

export default async function MypageInquiryDetailPage(props: PageProps<'/mypage/inquiries/[id]'>) {
  const { id } = await props.params;
  const locale = await getLocale();
  const t = locales[locale];
  const consumer = await getCurrentConsumer();
  const inquiry = await getInquiryById(id);

  if (!consumer || !inquiry || inquiry.consumer_id !== consumer.id) {
    notFound();
  }

  const [messagesPage, relatedOrder] = await Promise.all([
    getInquiryMessagesPage(inquiry.id),
    inquiry.category === INQUIRY_CATEGORY.ORDER && inquiry.order_id
      ? getInquiryOrderContext(inquiry.order_id)
      : Promise.resolve(null),
  ]);
  const { messages, hasMore } = messagesPage;
  const lastMessage = messages[messages.length - 1];
  const hasNewConsumerReply =
    inquiry.answered_at !== null && lastMessage?.author_type === INQUIRY_MESSAGE_AUTHOR.CONSUMER;
  const isAnswered = inquiry.answered_at !== null && !hasNewConsumerReply;
  const couponDiscountLabel = relatedOrder?.coupon
    ? relatedOrder.coupon.discountType === DISCOUNT_TYPE.PERCENTAGE
      ? `${relatedOrder.coupon.discountValue}%`
      : formatCurrency(relatedOrder.coupon.discountValue)
    : null;

  return (
    <div className="flex flex-1 flex-col gap-6 px-10 py-10">
      <div className="max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-border pb-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="min-w-0 font-heading text-2xl font-bold [overflow-wrap:anywhere] break-words text-foreground">
              {inquiry.title}
            </h1>
            <Badge
              className={
                isAnswered
                  ? 'bg-order-status-done/10 text-order-status-done'
                  : 'bg-primary-soft text-primary'
              }
            >
              {isAnswered
                ? t.consumer.inquiries.statusAnswered
                : t.consumer.inquiries.statusPending}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-muted text-muted-foreground">
              {inquiry.category === INQUIRY_CATEGORY.ORDER
                ? t.consumer.inquiries.form.categoryOptions.order
                : t.consumer.inquiries.form.categoryOptions.general}
            </Badge>
            <span className="text-sm text-muted-foreground">{formatDate(inquiry.created_at)}</span>
          </div>
          {relatedOrder ? (
            <div className="mt-2 flex flex-col gap-1 rounded-lg bg-muted p-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">
                  {relatedOrder.productName ?? relatedOrder.title}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatIdPrefix(relatedOrder.id)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {relatedOrder.quantity}
                {t.checkout.quantitySuffix} / {formatCurrency(relatedOrder.amount)} /{' '}
                {formatDate(relatedOrder.createdAt)}
              </span>
              <span className="text-xs text-muted-foreground">
                {relatedOrder.coupon && couponDiscountLabel
                  ? `${t.consumer.inquiries.couponUsedLabel}: ${relatedOrder.coupon.code} (${couponDiscountLabel})`
                  : t.consumer.inquiries.couponNotUsedLabel}
              </span>
            </div>
          ) : null}
        </div>

        <InquiryMessageThread
          inquiryId={inquiry.id}
          initialMessages={messages}
          initialHasMore={hasMore}
        />

        <Link
          href={CONSUMER_ROUTES.INQUIRIES}
          className="mt-6 inline-block text-sm font-medium text-foreground underline"
        >
          {t.consumer.inquiries.backToList}
        </Link>
      </div>
    </div>
  );
}
