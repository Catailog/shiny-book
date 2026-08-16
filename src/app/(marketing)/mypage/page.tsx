import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

const MOCK_STATS = [
  { key: 'completed', value: '8', suffix: 'volumeSuffix', tone: 'text-foreground' },
  { key: 'inProgress', value: '2', suffix: 'volumeSuffix', tone: 'text-primary' },
  { key: 'inquiries', value: '1', suffix: 'countSuffix', tone: 'text-foreground' },
] as const;

const MOCK_ORDERS = [
  {
    id: 'BC-2026-9041',
    date: '2026.02.14',
    title: 'Hardcover Photobook (10x10in)',
    option: '80p / Linen Warm Gray',
    image: '/images/products/hardcover-photobook.png',
    status: '제작 대기',
    statusClass: 'bg-muted text-muted-foreground',
  },
  {
    id: 'BC-2026-8734',
    date: '2026.01.28',
    title: 'Premium Photo Album (12x12in)',
    option: '120p / Italian Grain Brown',
    image: '/images/products/premium-photo-album.png',
    status: '인쇄 중',
    statusClass: 'bg-order-status-pending/10 text-order-status-pending',
  },
  {
    id: 'BC-2026-8430',
    date: '2025.12.15',
    title: 'Travel Journal (6x8in)',
    option: '64p / Classic Cloth Green',
    image: '/images/products/travel-journal.png',
    status: '배송 완료',
    statusClass: 'bg-order-status-done/10 text-order-status-done',
  },
] as const;

export default async function MypagePage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 flex-col gap-8 px-10 py-10">
      <div>
        <h1 className="font-heading text-4xl font-bold text-foreground">
          {t.consumer.mypage.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{t.consumer.mypage.subtitle}</p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {MOCK_STATS.map((stat) => (
          <div
            key={stat.key}
            className="flex flex-col gap-2 rounded-lg border border-border bg-muted p-6"
          >
            <span className="text-sm font-semibold text-muted-foreground">
              {t.consumer.mypage.stats[stat.key]}
            </span>
            <span className={`font-heading text-4xl font-bold ${stat.tone}`}>
              {stat.value} {t.consumer.mypage.stats[stat.suffix]}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-heading text-2xl font-bold text-foreground">
          {t.consumer.mypage.recentOrdersTitle}
        </h2>
        <div className="flex flex-col gap-4">
          {MOCK_ORDERS.map((order) => (
            <div
              key={order.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image src={order.image} alt="" fill sizes="80px" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-semibold">{order.id}</span>
                  <span>{order.date}</span>
                </div>
                <p className="font-heading text-lg font-bold text-foreground">{order.title}</p>
                <p className="text-sm text-muted-foreground">{order.option}</p>
              </div>
              <Badge className={order.statusClass}>{order.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
