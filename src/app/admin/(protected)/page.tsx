import {
  DollarSign,
  Download,
  FileText,
  Image as ImageIcon,
  Settings,
  ShoppingCart,
  Tag,
} from 'lucide-react';

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
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

import { AdminTopbar } from './admin-topbar';

const MOCK_KPIS = [
  { key: 'todayOrders', value: '38', change: '+12.3%', positive: true, icon: ShoppingCart },
  { key: 'pendingProduction', value: '142', change: '-2.4%', positive: false, icon: Settings },
  { key: 'revenueThisMonth', value: '₩18.4M', change: '+8.1%', positive: true, icon: DollarSign },
  { key: 'activeCoupons', value: '12', change: '0.0%', positive: true, icon: Tag },
] as const;

const MOCK_SUBMISSIONS = [
  {
    orderId: '#BC-2025',
    customer: 'Minwoo Lee',
    product: 'Premium Photo Album (12 x 12 in)',
    status: 'In Production',
    manuscriptOk: true,
    coverOk: true,
    date: '2025.10.12',
    amount: '₩160,000',
  },
  {
    orderId: '#BC-2024',
    customer: 'Suhyun Kim',
    product: 'Hardcover Photobook (10 x 10 in)',
    status: 'Received',
    manuscriptOk: true,
    coverOk: false,
    date: '2025.10.11',
    amount: '₩85,000',
  },
];

export default async function AdminDashboardPage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 flex-col">
      <AdminTopbar title={t.admin.dashboard.title} />
      <div className="flex flex-1 flex-col gap-6 px-10 py-8">
        <div className="grid grid-cols-4 gap-6">
          {MOCK_KPIS.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.key}
                className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-muted-foreground">
                    {t.admin.dashboard.kpi[kpi.key]}
                  </span>
                  <div className="flex size-9 items-center justify-center rounded-md bg-primary-soft">
                    <Icon aria-hidden="true" className="size-4.5 text-primary" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="font-heading text-3xl font-bold text-foreground">
                    {kpi.value}
                  </span>
                  <span className="text-xs">
                    <span
                      className={
                        kpi.positive
                          ? 'font-semibold text-order-status-done'
                          : 'font-semibold text-destructive'
                      }
                    >
                      {kpi.change}
                    </span>{' '}
                    <span className="text-muted-foreground">
                      {t.admin.dashboard.kpi.vsLastMonth}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-foreground">
              {t.admin.dashboard.recentSubmissions.title}
            </h2>
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Download aria-hidden="true" className="size-3.5" />
                {t.admin.dashboard.recentSubmissions.exportCsv}
              </Button>
              <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {t.admin.dashboard.recentSubmissions.viewAll}
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.admin.dashboard.recentSubmissions.columns.orderId}</TableHead>
                <TableHead>{t.admin.dashboard.recentSubmissions.columns.customer}</TableHead>
                <TableHead>{t.admin.dashboard.recentSubmissions.columns.product}</TableHead>
                <TableHead>{t.admin.dashboard.recentSubmissions.columns.status}</TableHead>
                <TableHead>{t.admin.dashboard.recentSubmissions.columns.files}</TableHead>
                <TableHead>{t.admin.dashboard.recentSubmissions.columns.date}</TableHead>
                <TableHead className="text-right">
                  {t.admin.dashboard.recentSubmissions.columns.amount}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_SUBMISSIONS.map((submission) => (
                <TableRow key={submission.orderId}>
                  <TableCell className="font-semibold text-foreground">
                    {submission.orderId}
                  </TableCell>
                  <TableCell>{submission.customer}</TableCell>
                  <TableCell>{submission.product}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{submission.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1.5">
                      <Badge
                        className={
                          submission.manuscriptOk
                            ? 'gap-1 bg-order-status-done/10 text-order-status-done'
                            : 'gap-1 bg-destructive/10 text-destructive'
                        }
                      >
                        <FileText aria-hidden="true" className="size-3" />
                        MAN
                      </Badge>
                      <Badge
                        className={
                          submission.coverOk
                            ? 'gap-1 bg-order-status-done/10 text-order-status-done'
                            : 'gap-1 bg-destructive/10 text-destructive'
                        }
                      >
                        <ImageIcon aria-hidden="true" className="size-3" />
                        {submission.coverOk ? 'COV' : 'MISSING'}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{submission.date}</TableCell>
                  <TableCell className="text-right font-semibold text-foreground">
                    {submission.amount}
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
