import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getInquiriesByConsumer } from '@/lib/inquiries/get-inquiries-by-consumer';
import { defaultLocale, locales } from '@/locales';

export default async function InquiriesPage() {
  const t = locales[defaultLocale];
  const consumer = await getCurrentConsumer();
  const inquiries = consumer ? await getInquiriesByConsumer(consumer.id) : [];

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">{t.consumer.inquiries.title}</h1>
        <Button render={<Link href={CONSUMER_ROUTES.NEW_INQUIRY} />} nativeButton={false}>
          {t.consumer.inquiries.newButton}
        </Button>
      </div>
      <Card className="max-w-2xl">
        <CardContent>
          {inquiries.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t.consumer.inquiries.empty}</p>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {inquiries.map((inquiry) => (
                <li key={inquiry.id}>
                  <Link
                    href={`/mypage/inquiries/${inquiry.id}`}
                    className="flex items-center justify-between gap-4 py-4"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground">{inquiry.title}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(inquiry.created_at).toLocaleDateString('ko-KR')}
                      </span>
                    </div>
                    <Badge variant="outline">
                      {inquiry.answer
                        ? t.consumer.inquiries.statusAnswered
                        : t.consumer.inquiries.statusPending}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
