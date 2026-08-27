import { notFound } from 'next/navigation';

import { StarRating } from '@/components/star-rating';
import { ORDER_STATUS } from '@/constants/order-status';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { formatDate } from '@/lib/format-date';
import { getLocale } from '@/lib/i18n/get-locale';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { getReviewByOrderId } from '@/lib/reviews/get-review-by-order-id';
import { locales } from '@/locales';

import { ReviewForm } from './review-form';

export default async function OrderReviewPage(props: PageProps<'/mypage/orders/[orderId]/review'>) {
  const { orderId } = await props.params;
  const locale = await getLocale();
  const t = locales[locale];
  const consumer = await getCurrentConsumer();
  const order = await getOrderById(orderId);

  if (!consumer || !order || order.consumer_id !== consumer.id) {
    notFound();
  }

  if (order.status !== ORDER_STATUS.COMPLETED) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-8 text-center">
        <p className="text-lg font-medium text-foreground">{t.consumer.reviews.notCompleted}</p>
      </div>
    );
  }

  const review = await getReviewByOrderId(orderId);

  return (
    <div className="flex flex-1 flex-col gap-6 px-6 py-8">
      <h1 className="text-2xl font-semibold text-foreground">{order.title}</h1>
      {review ? (
        <div className="flex max-w-md flex-col gap-2 rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <StarRating value={review.rating} readOnly />
            <span className="text-xs text-muted-foreground">{formatDate(review.created_at)}</span>
          </div>
          {review.content ? (
            <p className="text-sm whitespace-pre-wrap text-foreground">{review.content}</p>
          ) : null}
        </div>
      ) : (
        <ReviewForm orderId={orderId} />
      )}
    </div>
  );
}
