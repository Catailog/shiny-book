import Link from 'next/link';

import { ChevronRight } from 'lucide-react';

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
import { ADMIN_ROUTES } from '@/constants/routes';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

import { AdminTopbar } from '../admin-topbar';

const MOCK_INQUIRIES = [
  {
    id: '1045',
    customer: '한지원',
    category: 'Wedding Album',
    subject: '실크 은박 맞춤 인그레이빙 폰트 질문입니다.',
    status: 'new',
    receivedAt: '10 min ago',
  },
  {
    id: '1044',
    customer: '데이비드',
    category: 'Travel Journal',
    subject: '커버 선택 시 가죽 마감 내구성 및 방수 유무',
    status: 'inProgress',
    receivedAt: '2 hours ago',
  },
  {
    id: '1043',
    customer: '최미경',
    category: 'Hardcover Book',
    subject: '대량 주문 시 추가 단체 할인 견적 문의',
    status: 'answered',
    receivedAt: '1 day ago',
  },
  {
    id: '1042',
    customer: '홍성민',
    category: "Baby's Book",
    subject: '레이아웃 디자인에 직접 작성한 자필 편지 인쇄건',
    status: 'answered',
    receivedAt: '2 days ago',
  },
  {
    id: '1041',
    customer: '윤다혜',
    category: 'Wedding Album',
    subject: '포토북 주문 후 사진 교체 불가능 여부 재확인',
    status: 'closed',
    receivedAt: '5 days ago',
  },
] as const;

const STATUS_BADGE_CLASS = {
  new: 'bg-destructive/10 text-destructive',
  inProgress: 'bg-order-status-pending/10 text-order-status-pending',
  answered: 'bg-order-status-done/10 text-order-status-done',
  closed: 'bg-muted text-muted-foreground',
} as const;

export default async function AdminInquiriesPage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.inquiries.title} subtitle={t.admin.inquiries.list.subtitle} />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="flex gap-2">
          <Button variant="default" size="sm" className="rounded-full">
            {t.admin.inquiries.list.statusTabs.all} (32)
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            {t.admin.inquiries.list.statusTabs.new} (4)
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            {t.admin.inquiries.list.statusTabs.inProgress} (8)
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            {t.admin.inquiries.list.statusTabs.answered} (16)
          </Button>
          <Button variant="outline" size="sm" className="rounded-full">
            {t.admin.inquiries.list.statusTabs.closed} (4)
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.admin.inquiries.list.table.inquiryNo}</TableHead>
                <TableHead>{t.admin.inquiries.list.table.customerName}</TableHead>
                <TableHead>{t.admin.inquiries.list.table.category}</TableHead>
                <TableHead>{t.admin.inquiries.list.table.subject}</TableHead>
                <TableHead>{t.admin.inquiries.list.table.status}</TableHead>
                <TableHead>{t.admin.inquiries.list.table.receivedDate}</TableHead>
                <TableHead className="text-right">{t.admin.inquiries.list.table.view}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_INQUIRIES.map((inquiry) => (
                <TableRow
                  key={inquiry.id}
                  className={inquiry.status === 'new' ? 'bg-primary-soft' : ''}
                >
                  <TableCell className="font-semibold text-foreground">#{inquiry.id}</TableCell>
                  <TableCell>{inquiry.customer}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{inquiry.category}</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{inquiry.subject}</TableCell>
                  <TableCell>
                    <Badge className={STATUS_BADGE_CLASS[inquiry.status]}>
                      {t.admin.inquiries.list.statusTabs[inquiry.status]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{inquiry.receivedAt}</TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`${ADMIN_ROUTES.INQUIRIES}/${inquiry.id}`}
                      className="inline-flex text-muted-foreground hover:text-foreground"
                      aria-label={inquiry.subject}
                    >
                      <ChevronRight aria-hidden="true" className="size-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
