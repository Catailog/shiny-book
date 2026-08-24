import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { DISCOUNT_TYPE } from '@/constants/coupon';
import { INQUIRY_MESSAGE_AUTHOR } from '@/constants/inquiry';
import { INQUIRY_CATEGORY } from '@/constants/inquiry-category';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { formatDate, formatDateTime } from '@/lib/format-date';
import { formatCurrency } from '@/lib/format/currency';
import { getLocale } from '@/lib/i18n/get-locale';
import { getInquiryById } from '@/lib/inquiries/get-inquiry-by-id';
import { getInquiryMessages } from '@/lib/inquiries/get-inquiry-messages';
import { getInquiryOrderContext } from '@/lib/inquiries/get-inquiry-order-context';
import { locales } from '@/locales';

import { ReplyForm } from './reply-form';

export default async function MypageInquiryDetailPage(props: PageProps<'/mypage/inquiries/[id]'>) {
  const { id } = await props.params;
  const locale = await getLocale();
  const t = locales[locale];
  const consumer = await getCurrentConsumer();
  const inquiry = await getInquiryById(id);

  if (!consumer || !inquiry || inquiry.consumer_id !== consumer.id) {
    notFound();
  }

  const [messages, relatedOrder] = await Promise.all([
    getInquiryMessages(inquiry.id),
    inquiry.category === INQUIRY_CATEGORY.ORDER && inquiry.order_id
      ? getInquiryOrderContext(inquiry.order_id)
      : Promise.resolve(null),
  ]);
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
            <h1 className="font-heading text-2xl font-bold text-foreground">{inquiry.title}</h1>
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
                  #{relatedOrder.id.slice(0, 8)}
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

        <div className="mt-6 flex flex-col gap-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={
                message.author_type === INQUIRY_MESSAGE_AUTHOR.ADMIN
                  ? 'flex flex-col gap-1 rounded-lg border border-primary/30 bg-primary-soft/40 p-4'
                  : 'flex flex-col gap-1 rounded-lg bg-muted p-4'
              }
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold text-muted-foreground">
                  {message.author_type === INQUIRY_MESSAGE_AUTHOR.ADMIN
                    ? t.consumer.inquiries.adminAuthorLabel
                    : t.consumer.inquiries.consumerAuthorLabel}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDateTime(message.created_at)}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap text-foreground">{message.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <span className="text-sm font-medium text-foreground">
            {t.consumer.inquiries.threadLabel}
          </span>
          <ReplyForm inquiryId={inquiry.id} />
        </div>

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
