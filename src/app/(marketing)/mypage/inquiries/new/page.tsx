import { INQUIRY_CATEGORY } from '@/constants/inquiry-category';
import { getCurrentConsumer } from '@/lib/auth/get-current-consumer';
import { getLocale } from '@/lib/i18n/get-locale';
import { getOrdersByConsumer } from '@/lib/orders/get-orders-by-consumer';
import { locales } from '@/locales';

import { InquiryForm } from './inquiry-form';

export default async function MypageNewInquiryPage(props: PageProps<'/mypage/inquiries/new'>) {
  const searchParams = await props.searchParams;
  const requestedOrderId = firstParam(searchParams.orderId);

  const locale = await getLocale();
  const t = locales[locale];
  const consumer = await getCurrentConsumer();
  const orders = consumer ? await getOrdersByConsumer(consumer.id) : [];
  const defaultOrderId = orders.some((order) => order.id === requestedOrderId)
    ? requestedOrderId
    : undefined;

  return (
    <div className="flex flex-1 flex-col gap-8 px-10 py-10">
      <h1 className="font-heading text-4xl font-bold text-foreground">
        {t.consumer.inquiries.newTitle}
      </h1>
      <InquiryForm
        orders={orders}
        defaultCategory={defaultOrderId ? INQUIRY_CATEGORY.ORDER : INQUIRY_CATEGORY.GENERAL}
        defaultOrderId={defaultOrderId}
      />
    </div>
  );
}

function firstParam(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? '') : (value ?? '');
}
