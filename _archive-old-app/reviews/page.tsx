import { SiteContainer } from '@/components/site-container';
import { REVIEW_LIST_LIMIT } from '@/constants/review';
import { getReviews } from '@/lib/reviews/get-reviews';
import { defaultLocale, locales } from '@/locales';

export default async function ReviewListPage() {
  const t = locales[defaultLocale];
  const reviews = await getReviews(REVIEW_LIST_LIMIT);

  return (
    <SiteContainer className="flex max-w-2xl flex-1 flex-col gap-6 py-12">
      <h1 className="text-2xl font-semibold text-foreground">{t.review.title}</h1>
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t.review.empty}</p>
      ) : (
        <ul className="flex flex-col divide-y divide-border">
          {reviews.map((review) => (
            <li
              key={review.id}
              id={`review-${review.id}`}
              className="flex scroll-mt-20 flex-col gap-1 py-4"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-medium text-foreground">{review.orderTitle}</span>
                <span className="text-sm text-muted-foreground">{review.rating} / 5</span>
              </div>
              <p className="text-sm whitespace-pre-wrap text-foreground">{review.content}</p>
              <span className="text-sm text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString('ko-KR')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </SiteContainer>
  );
}
