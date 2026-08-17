import { SiteContainer } from '@/components/site-container';
import { StarRating } from '@/components/star-rating';
import { REVIEW_LIST_LIMIT, REVIEW_RATING_MAX, REVIEW_RATING_MIN } from '@/constants/review';
import { formatDate } from '@/lib/format-date';
import { getLocale } from '@/lib/i18n/get-locale';
import { getReviews } from '@/lib/reviews/get-reviews';
import { locales } from '@/locales';

const RATING_VALUES = Array.from(
  { length: REVIEW_RATING_MAX - REVIEW_RATING_MIN + 1 },
  (_, index) => REVIEW_RATING_MAX - index,
);

export default async function ReviewsPage() {
  const locale = await getLocale();
  const t = locales[locale];
  const reviews = await getReviews(REVIEW_LIST_LIMIT);

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
  const ratingBreakdown = RATING_VALUES.map((stars) => {
    const count = reviews.filter((review) => review.rating === stars).length;
    const percent = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { stars, percent };
  });

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
              <span className="font-heading text-6xl font-bold text-foreground">
                {averageRating.toFixed(1)}
              </span>
              <StarRating value={Math.round(averageRating)} readOnly />
              <span className="text-sm text-muted-foreground">
                {t.review.hero.totalReviewsLabel.replace('{count}', String(reviews.length))}
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-2.5">
              {ratingBreakdown.map((row) => (
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
        <div className="flex items-center gap-2 border-b border-border pb-4">
          <span className="rounded-lg border border-primary bg-primary-soft px-3 py-1.5 text-sm text-primary">
            {t.review.filters.allProducts}
          </span>
        </div>

        {reviews.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">{t.review.empty}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex flex-col gap-4 rounded-lg border border-border bg-input-background p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-12 shrink-0 rounded-full bg-muted" />
                    <div>
                      <p className="text-base font-semibold text-foreground">
                        {review.productName ?? review.orderTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(review.created_at)}
                      </p>
                    </div>
                  </div>
                  <StarRating value={review.rating} readOnly />
                </div>
                <p className="text-sm leading-relaxed text-foreground">{review.content}</p>
              </div>
            ))}
          </div>
        )}
      </SiteContainer>
    </div>
  );
}
