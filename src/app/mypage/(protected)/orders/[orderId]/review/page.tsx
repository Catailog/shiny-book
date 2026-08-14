import { notFound } from 'next/navigation';

import { ORDER_STATUS } from '@/constants/order-status';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getOrderById } from '@/lib/orders/get-order-by-id';
import { getReviewByOrderId } from '@/lib/reviews/get-review-by-order-id';
import { defaultLocale, locales } from '@/locales';

import { ReviewForm } from './review-form';

export default async function OrderReviewPage(props: PageProps<'/mypage/orders/[orderId]/review'>) {
  const { orderId } = await props.params;
  const t = locales[defaultLocale];
  const consumer = await getCurrentConsumer();
  const order = await getOrderById(orderId);

  if (!consumer || !order || order.consumer_id !== consumer.id) {
    notFound();
  }

  if (order.status !== ORDER_STATUS.COMPLETED) {
    return (
      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-2 px-4 text-center">
        <p className="text-lg font-medium text-foreground">{t.consumer.reviews.notCompleted}</p>
      </main>
    );
  }

  const review = await getReviewByOrderId(orderId);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-12">
      <h1 className="text-2xl font-semibold text-foreground">{order.title}</h1>
      {review ? (
        <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
          <span className="text-sm font-medium text-foreground">
            {t.consumer.reviews.ratingLabel} {review.rating} / 5
          </span>
          <p className="text-sm whitespace-pre-wrap text-foreground">{review.content}</p>
        </div>
      ) : (
        <ReviewForm orderId={orderId} />
      )}
    </main>
  );
}
