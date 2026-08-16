import Image from 'next/image';

import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

import { SiteContainer } from '@/components/site-container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getLocale } from '@/lib/i18n/get-locale';
import { locales } from '@/locales';

const RATING_BREAKDOWN = [
  { stars: 5, percent: 82 },
  { stars: 4, percent: 12 },
  { stars: 3, percent: 4 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 1 },
] as const;

const MOCK_REVIEWS = [
  {
    name: '김수현',
    date: '2026.02.10',
    productTag: 'Wedding Album',
    image: '/images/products/wedding-album.png',
    content:
      '결혼식 사진들을 일반 인화 앨범 대신 북크래프트 실크 양장본으로 제작했는데, 거실 선반에 세워두기만 해도 하나의 인테리어 오브제가 되네요. 종이 감촉이 너무 고급스럽고 마감이 정교합니다.',
  },
  {
    name: '이민우',
    date: '2026.02.04',
    productTag: 'Travel Journal',
    image: '/images/products/travel-journal.png',
    content:
      '아이와의 3주간의 유럽 여행을 책 한 권에 모았습니다. 사철 제본 덕분에 180도로 시원하게 펴져 파노라마 풍경 사진도 완벽하게 살릴 수 있었네요. 다음 여행 때도 꼭 다시 찾아올게요.',
  },
  {
    name: '박지영',
    date: '2026.01.28',
    productTag: "Baby's First Year",
    image: '/images/products/babys-first-year.png',
    content:
      '아기의 첫 1년을 기록한 성장 앨범인데 너무 마음에 들어요. 레이아웃 템플릿이 군더더기 없고 여백이 조화로워서 마치 예술가 화보집 같은 클래식한 분위기가 연출됩니다. 육아 동기들에게도 추천했어요!',
  },
] as const;

function StarRow({ filled = 5 }: { filled?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={index < filled ? 'size-4 fill-primary text-primary' : 'size-4 text-border'}
        />
      ))}
    </div>
  );
}

export default async function ReviewsPage() {
  const locale = await getLocale();
  const t = locales[locale];

  return (
    <div className="flex flex-1 flex-col">
      <div className="bg-muted py-16">
        <SiteContainer className="flex flex-col gap-8">
          <div className="text-center">
            <p className="text-sm font-semibold text-primary uppercase">{t.review.hero.eyebrow}</p>
            <h1 className="mt-2 font-heading text-5xl font-bold text-foreground">
              {t.review.hero.title}
            </h1>
          </div>
          <div className="flex items-center gap-10 rounded-lg border border-border bg-card p-8">
            <div className="flex flex-col items-center gap-2 border-r border-border pr-10">
              <span className="font-heading text-6xl font-bold text-foreground">4.8</span>
              <StarRow filled={5} />
              <span className="text-sm text-muted-foreground">
                {t.review.hero.totalReviewsLabel.replace('{count}', '1,280')}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2.5">
              {RATING_BREAKDOWN.map((row) => (
                <div key={row.stars} className="flex items-center gap-3 text-sm">
                  <span className="w-16 text-muted-foreground">{row.stars} Stars</span>
                  <div className="h-2 flex-1 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="w-10 text-right font-semibold text-foreground">
                    {row.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </SiteContainer>
      </div>

      <SiteContainer className="flex flex-col gap-6 py-10">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-primary bg-primary-soft text-primary"
            >
              {t.review.filters.allProducts}
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            {t.review.filters.sortLabel} {t.review.filters.sortMostRecent}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.name}
              className="flex flex-col gap-4 rounded-lg border border-border bg-card p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-12 shrink-0 rounded-full bg-muted" />
                  <div>
                    <p className="text-base font-semibold text-foreground">{review.name}</p>
                    <p className="text-xs text-muted-foreground">{review.date}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StarRow filled={5} />
                  <Badge className="bg-muted text-primary">{review.productTag}</Badge>
                </div>
              </div>
              <div className="flex items-start justify-between gap-6">
                <p className="text-sm leading-relaxed text-foreground">{review.content}</p>
                <div className="relative size-22.5 shrink-0 overflow-hidden rounded-md border border-border">
                  <Image src={review.image} alt="" fill sizes="90px" className="object-cover" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="icon" aria-label="Previous page">
            <ChevronLeft aria-hidden="true" className="size-4" />
          </Button>
          {[1, 2, 3, 4, 5].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? 'default' : 'outline'}
              size="icon"
              className={page === 1 ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''}
            >
              {page}
            </Button>
          ))}
          <Button variant="outline" size="icon" aria-label="Next page">
            <ChevronRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </SiteContainer>
    </div>
  );
}
