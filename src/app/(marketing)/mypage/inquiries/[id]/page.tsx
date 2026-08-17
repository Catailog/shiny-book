import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { formatDate } from '@/lib/format-date';
import { getLocale } from '@/lib/i18n/get-locale';
import { getInquiryById } from '@/lib/inquiries/get-inquiry-by-id';
import { locales } from '@/locales';

export default async function MypageInquiryDetailPage(props: PageProps<'/mypage/inquiries/[id]'>) {
  const { id } = await props.params;
  const locale = await getLocale();
  const t = locales[locale];
  const consumer = await getCurrentConsumer();
  const inquiry = await getInquiryById(id);

  if (!consumer || !inquiry || inquiry.consumer_id !== consumer.id) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-10 py-10">
      <div className="max-w-2xl rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-2 border-b border-border pb-4">
          <div className="flex items-center justify-between gap-4">
            <h1 className="font-heading text-2xl font-bold text-foreground">{inquiry.title}</h1>
            <Badge
              className={
                inquiry.answer
                  ? 'bg-order-status-done/10 text-order-status-done'
                  : 'bg-primary-soft text-primary'
              }
            >
              {inquiry.answer
                ? t.consumer.inquiries.statusAnswered
                : t.consumer.inquiries.statusPending}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">{formatDate(inquiry.created_at)}</span>
        </div>
        <p className="mt-6 whitespace-pre-wrap text-foreground">{inquiry.content}</p>
        {inquiry.answer ? (
          <div className="mt-6 flex flex-col gap-2 rounded-lg bg-muted p-4">
            <span className="text-sm font-medium text-foreground">
              {t.consumer.inquiries.answerLabel}
            </span>
            <p className="text-sm whitespace-pre-wrap text-foreground">{inquiry.answer}</p>
          </div>
        ) : null}
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
