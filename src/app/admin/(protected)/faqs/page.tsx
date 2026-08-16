import Link from 'next/link';

import { Plus, Search } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

const MOCK_FAQS = [
  {
    id: '1',
    title: '제작 완료된 포토북의 배송 기간은 얼마나 걸리나요?',
    category: 'Shipping',
    displayOrder: 1,
    status: 'published',
    lastEdited: '2025.10.12',
  },
  {
    id: '2',
    title: '친환경 FSC 보존 용지와 일반 인화지의 차이점은 무엇인가요?',
    category: 'Materials',
    displayOrder: 2,
    status: 'published',
    lastEdited: '2025.10.10',
  },
  {
    id: '3',
    title: '주문 완료 후 사진 수정이나 페이지 추가가 가능한가요?',
    category: 'Ordering',
    displayOrder: 3,
    status: 'draft',
    lastEdited: '2025.10.08',
  },
  {
    id: '4',
    title: '인쇄 불량 및 수공예 제본 파손 시 반품/환불 규정이 어떻게 되나요?',
    category: 'Returns',
    displayOrder: 4,
    status: 'published',
    lastEdited: '2025.09.28',
  },
  {
    id: '5',
    title: '해외 배송 서비스 지원 범위와 관부가세 청구 안내',
    category: 'Shipping',
    displayOrder: 5,
    status: 'draft',
    lastEdited: '2025.09.15',
  },
] as const;

export default async function AdminFaqsPage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar
        title={t.admin.faqs.title}
        subtitle={t.admin.faqs.list.subtitle}
        actions={
          <Button render={<Link href={ADMIN_ROUTES.FAQS_NEW} />} nativeButton={false}>
            <Plus aria-hidden="true" className="size-4" />
            {t.admin.faqs.writeButton}
          </Button>
        }
      />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="flex items-center justify-between rounded-lg border border-border bg-card px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                aria-hidden="true"
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="search"
                placeholder={t.admin.faqs.list.searchPlaceholder}
                className="w-70 pl-9"
              />
            </div>
            <Button variant="outline">{t.admin.faqs.list.allCategories}</Button>
            <Button variant="outline">{t.admin.faqs.list.allStatuses}</Button>
          </div>
          <span className="text-sm text-muted-foreground">
            {t.admin.faqs.list.showingCount
              .replace('{shown}', String(MOCK_FAQS.length))
              .replace('{total}', '12')}
          </span>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.admin.faqs.list.table.title}</TableHead>
                <TableHead>{t.admin.faqs.list.table.category}</TableHead>
                <TableHead className="text-center">
                  {t.admin.faqs.list.table.displayOrder}
                </TableHead>
                <TableHead>{t.admin.faqs.list.table.status}</TableHead>
                <TableHead>{t.admin.faqs.list.table.lastEdited}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_FAQS.map((faq) => (
                <TableRow key={faq.id}>
                  <TableCell className="font-medium text-foreground">{faq.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{faq.category}</Badge>
                  </TableCell>
                  <TableCell className="text-center">{faq.displayOrder}</TableCell>
                  <TableCell>
                    {faq.status === 'published' ? (
                      <Badge className="bg-order-status-done/10 text-order-status-done">
                        {t.admin.announcements.list.statusLabels.published}
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        {t.admin.announcements.list.statusLabels.draft}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{faq.lastEdited}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
