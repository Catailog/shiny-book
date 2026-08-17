import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { INQUIRY_CATEGORY } from '@/constants/inquiry-category';
import { ADMIN_ROUTES } from '@/constants/routes';
import { formatDate } from '@/lib/format-date';
import { getInquiryById } from '@/lib/inquiries/get-inquiry-by-id';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { defaultLocale, locales } from '@/locales';

import { AdminTopbar } from '../../admin-topbar';
import { AnswerInquiryForm } from './answer-form';

export default async function AdminInquiryDetailPage(props: PageProps<'/admin/inquiries/[id]'>) {
  const { id } = await props.params;
  const inquiry = await getInquiryById(id);
  const t = locales[defaultLocale];

  if (!inquiry) {
    notFound();
  }

  const relatedOrder =
    inquiry.category === INQUIRY_CATEGORY.ORDER && inquiry.order_id
      ? await getOrderById(inquiry.order_id)
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
              {relatedOrder ? ` - ${relatedOrder.title}` : ''}
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-muted-foreground">
              {t.admin.inquiries.detail.subjectLabel}
            </span>
            <p className="font-semibold text-foreground">{inquiry.title}</p>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold text-muted-foreground">
              {t.admin.inquiries.detail.originalMessageLabel}
            </span>
            <p className="text-sm whitespace-pre-line text-muted-foreground">{inquiry.content}</p>
            <span className="text-xs text-muted-foreground">{formatDate(inquiry.created_at)}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-muted-foreground">
              {t.admin.inquiries.answerLabel}
            </span>
            <AnswerInquiryForm id={inquiry.id} defaultAnswer={inquiry.answer ?? ''} />
          </div>
        </div>
      </div>
    </div>
  );
}
