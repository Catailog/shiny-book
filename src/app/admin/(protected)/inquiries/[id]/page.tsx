import Link from 'next/link';
import { notFound } from 'next/navigation';

import { ArrowLeft } from 'lucide-react';

import { ADMIN_ROUTES } from '@/constants/routes';
import { formatDate } from '@/lib/format-date';
import { getLocale } from '@/lib/i18n/get-locale';
import { getInquiryById } from '@/lib/inquiries/get-inquiry-by-id';
import { locales } from '@/locales';

import { AdminTopbar } from '../../admin-topbar';
import { AnswerInquiryForm } from './answer-form';

export default async function AdminInquiryDetailPage(props: PageProps<'/admin/inquiries/[id]'>) {
  const { id } = await props.params;
  const inquiry = await getInquiryById(id);
  const locale = await getLocale();
  const t = locales[locale];

  if (!inquiry) {
    notFound();
  }

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
