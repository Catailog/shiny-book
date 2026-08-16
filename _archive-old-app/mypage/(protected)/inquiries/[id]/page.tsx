import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getInquiryById } from '@/lib/inquiries/get-inquiry-by-id';
import { defaultLocale, locales } from '@/locales';

export default async function InquiryDetailPage(props: PageProps<'/mypage/inquiries/[id]'>) {
  const { id } = await props.params;
  const t = locales[defaultLocale];
  const consumer = await getCurrentConsumer();
  const inquiry = await getInquiryById(id);

  if (!consumer || !inquiry || inquiry.consumer_id !== consumer.id) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <Card className="max-w-2xl">
        <CardContent className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 border-b border-border pb-4">
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-2xl font-semibold text-foreground">{inquiry.title}</h1>
              <Badge variant="outline">
                {inquiry.answer
                  ? t.consumer.inquiries.statusAnswered
                  : t.consumer.inquiries.statusPending}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">
              {new Date(inquiry.created_at).toLocaleString('ko-KR')}
            </span>
          </div>
          <p className="whitespace-pre-wrap text-foreground">{inquiry.content}</p>
          {inquiry.answer ? (
            <div className="flex flex-col gap-2 rounded-lg bg-muted p-4">
              <span className="text-sm font-medium text-foreground">
                {t.consumer.inquiries.answerLabel}
              </span>
              <p className="text-sm whitespace-pre-wrap text-foreground">{inquiry.answer}</p>
            </div>
          ) : null}
          <Link
            href={CONSUMER_ROUTES.INQUIRIES}
            className="text-sm font-medium text-foreground underline"
          >
            {t.consumer.inquiries.backToList}
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
