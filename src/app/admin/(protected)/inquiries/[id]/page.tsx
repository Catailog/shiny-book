import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { DISCOUNT_TYPE } from '@/constants/coupon';
import { INQUIRY_CATEGORY } from '@/constants/inquiry-category';
import { ADMIN_ROUTES } from '@/constants/routes';
import { getCurrentAdmin } from '@/lib/auth/get-current-admin';
import { formatDate } from '@/lib/format-date';
import { formatCurrency } from '@/lib/format/currency';
import { getInquiryById } from '@/lib/inquiries/get-inquiry-by-id';
import { getInquiryMessages } from '@/lib/inquiries/get-inquiry-messages';
import { getInquiryOrderContext } from '@/lib/inquiries/get-inquiry-order-context';
import { defaultLocale, locales } from '@/locales';

import { AdminTopbar } from '../../admin-topbar';
import { MessageThread } from './message-thread';
import { ReplyForm } from './reply-form';

export default async function AdminInquiryDetailPage(props: PageProps<'/admin/inquiries/[id]'>) {
  const { id } = await props.params;
  const [inquiry, admin] = await Promise.all([getInquiryById(id), getCurrentAdmin()]);
  const t = locales[defaultLocale];

  if (!inquiry || !admin) {
    notFound();
  }

  const [messages, relatedOrder] = await Promise.all([
    getInquiryMessages(inquiry.id),
    inquiry.category === INQUIRY_CATEGORY.ORDER && inquiry.order_id
      ? getInquiryOrderContext(inquiry.order_id)
      : Promise.resolve(null),
  ]);
  const couponDiscountLabel = relatedOrder?.coupon
    ? relatedOrder.coupon.discountType === DISCOUNT_TYPE.PERCENTAGE
      ? `${relatedOrder.coupon.discountValue}%`
      : formatCurrency(relatedOrder.coupon.discountValue)
    : null;

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={inquiry.title} />
      <div className="flex flex-1 flex-col gap-4 px-10 py-8">
        <Link
          href={ADMIN_ROUTES.INQUIRIES}
          className="flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          {t.admin.inquiries.detail.backToList}
        </Link>

        <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-muted-foreground">
              {t.admin.inquiries.list.table.category}
            </span>
            <p className="text-sm text-foreground">
              {inquiry.category === INQUIRY_CATEGORY.ORDER
                ? t.consumer.inquiries.form.categoryOptions.order
                : t.consumer.inquiries.form.categoryOptions.general}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-muted-foreground">
              {t.admin.inquiries.detail.subjectLabel}
            </span>
            <p className="font-semibold text-foreground">{inquiry.title}</p>
          </div>
          {relatedOrder ? (
            <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted p-4">
              <span className="text-xs font-bold text-muted-foreground">
                {t.admin.inquiries.detail.relatedOrderLabel}
              </span>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {relatedOrder.productName ?? relatedOrder.title}
                </p>
                <span className="text-xs text-muted-foreground">
                  #{relatedOrder.id.slice(0, 8)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {t.admin.inquiries.detail.relatedOrderQuantity} {relatedOrder.quantity}
                {t.admin.orders.quantitySuffix} / {t.admin.inquiries.detail.relatedOrderAmount}{' '}
                {formatCurrency(relatedOrder.amount)} / {t.admin.inquiries.detail.relatedOrderDate}{' '}
                {formatDate(relatedOrder.createdAt)}
              </p>
              <p className="text-xs text-muted-foreground">
                {relatedOrder.coupon && couponDiscountLabel
                  ? `${t.admin.inquiries.detail.couponUsedLabel}: ${relatedOrder.coupon.code} (${couponDiscountLabel})`
                  : t.admin.inquiries.detail.couponNotUsedLabel}
              </p>
            </div>
          ) : null}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-muted-foreground">
              {t.admin.inquiries.detail.threadLabel}
            </span>
            <MessageThread inquiryId={inquiry.id} messages={messages} currentAdminId={admin.id} />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-muted-foreground">
              {t.admin.inquiries.detail.replyLabel}
            </span>
            <ReplyForm inquiryId={inquiry.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
