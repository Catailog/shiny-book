import Link from 'next/link';

import { Plus } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CONSUMER_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

const MOCK_INQUIRIES = [
  {
    number: '04',
    category: '배송 문의',
    title: '배송지를 변경하고 싶습니다.',
    status: 'answered',
    date: '2026.02.15',
  },
  {
    number: '03',
    category: '제품 문의',
    title: '인그레이빙 문구 폰트 종류가 무엇이 있나요?',
    status: 'answered',
    date: '2026.02.10',
  },
  {
    number: '02',
    category: '기타 문의',
    title: '단체 주문(30권 이상) 할인 혜택이 적용되나요?',
    status: 'pending',
    date: '2026.02.04',
  },
  {
    number: '01',
    category: '제품 문의',
    title: '표지 실크 자수 가공 마감에 대해 질문이 있습니다.',
    status: 'answered',
    date: '2026.01.20',
  },
] as const;

export default async function MypageInquiriesPage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 flex-col gap-6 px-10 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-4xl font-bold text-foreground">
            {t.consumer.inquiries.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{t.consumer.inquiries.subtitle}</p>
        </div>
        <Button
          render={<Link href={CONSUMER_ROUTES.NEW_INQUIRY} />}
          nativeButton={false}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus aria-hidden="true" className="size-4" />
          {t.consumer.inquiries.newButton}
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="border-primary bg-primary-soft text-primary">
          {t.consumer.inquiries.filterTabs.all}
        </Button>
        <Button variant="outline" size="sm">
          {t.consumer.inquiries.filterTabs.answered}
        </Button>
        <Button variant="outline" size="sm">
          {t.consumer.inquiries.filterTabs.pending}
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t.consumer.inquiries.table.number}</TableHead>
            <TableHead>{t.consumer.inquiries.table.category}</TableHead>
            <TableHead>{t.consumer.inquiries.table.title}</TableHead>
            <TableHead>{t.consumer.inquiries.table.status}</TableHead>
            <TableHead>{t.consumer.inquiries.table.createdAt}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {MOCK_INQUIRIES.map((inquiry) => (
            <TableRow key={inquiry.number}>
              <TableCell className="text-muted-foreground">{inquiry.number}</TableCell>
              <TableCell className="text-muted-foreground">{inquiry.category}</TableCell>
              <TableCell className="font-semibold text-foreground">{inquiry.title}</TableCell>
              <TableCell>
                {inquiry.status === 'answered' ? (
                  <Badge className="bg-order-status-done/10 text-order-status-done">
                    {t.consumer.inquiries.statusAnswered}
                  </Badge>
                ) : (
                  <Badge className="bg-primary-soft text-primary">
                    {t.consumer.inquiries.statusPending}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">{inquiry.date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
