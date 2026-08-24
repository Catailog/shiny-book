import 'server-only';

import { INQUIRY_MESSAGE_AUTHOR } from '@/constants/inquiry';
import { INQUIRY_CATEGORY } from '@/constants/inquiry-category';
import { ORDER_STATUS, type OrderStatus } from '@/constants/order-status';
import { PHOTOBOOK_PAGE_COUNT_OPTIONS, PHOTOBOOK_PHOTOS_PER_PAGE } from '@/constants/photobook';
import { PRICING } from '@/constants/pricing';
import { TEST_HOME_ADDRESS, TEST_METRO_CITY_HALL_ADDRESSES } from '@/constants/test-account';
import { generateRandomBookTitle } from '@/lib/auth/generate-random-book-title';
import { getLocale } from '@/lib/i18n/get-locale';
import { calculateShippingFee } from '@/lib/orders/calculate-shipping-fee';
import { getAllProducts } from '@/lib/products/get-all-products';
import { pick, randomInt, sampleUnique } from '@/lib/random';
import { createServiceRoleClient } from '@/lib/supabase/service-role';
import { getRandomTestPhotoPath } from '@/lib/uploads/random-test-photo-path';

type ServiceRoleClient = ReturnType<typeof createServiceRoleClient>;

interface TestOrderPlanItem {
  status: OrderStatus;
  threadInquiry: boolean;
  simpleInquiry: boolean;
  review: boolean;
}

const TEST_ORDER_PLAN: readonly TestOrderPlanItem[] = [
  {
    status: ORDER_STATUS.AWAITING_PAYMENT,
    threadInquiry: false,
    simpleInquiry: false,
    review: false,
  },
  { status: ORDER_STATUS.PRINTING, threadInquiry: true, simpleInquiry: false, review: false },
  { status: ORDER_STATUS.BINDING, threadInquiry: false, simpleInquiry: false, review: false },
  { status: ORDER_STATUS.SHIPPING, threadInquiry: false, simpleInquiry: false, review: false },
  { status: ORDER_STATUS.COMPLETED, threadInquiry: false, simpleInquiry: true, review: false },
  { status: ORDER_STATUS.COMPLETED, threadInquiry: false, simpleInquiry: false, review: true },
];

interface SeedMessageSpec {
  authorType: (typeof INQUIRY_MESSAGE_AUTHOR)[keyof typeof INQUIRY_MESSAGE_AUTHOR];
  authorId: string | null;
  content: string;
}

async function seedInquiryThread(
  serviceClient: ServiceRoleClient,
  params: {
    consumerId: string;
    title: string;
    orderId: string;
    messages: readonly SeedMessageSpec[];
  },
): Promise<void> {
  const isAnswered = params.messages.some(
    (message) => message.authorType === INQUIRY_MESSAGE_AUTHOR.ADMIN,
  );

  const { data: insertedInquiry } = await serviceClient
    .from('inquiries')
    .insert({
      consumer_id: params.consumerId,
      category: INQUIRY_CATEGORY.ORDER,
      title: params.title,
      order_id: params.orderId,
      answered_at: isAnswered ? new Date().toISOString() : null,
    })
    .select('id')
    .single();

  if (!insertedInquiry) {
    return;
  }

  for (const message of params.messages) {
    await serviceClient.from('inquiry_messages').insert({
      inquiry_id: insertedInquiry.id,
      author_type: message.authorType,
      author_id: message.authorId,
      content: message.content,
    });
  }
}

export async function seedTestConsumerData(
  consumerId: string,
  adminAuthorId: string,
): Promise<void> {
  const serviceClient = createServiceRoleClient();
  const locale = await getLocale();
  const addressesToSeed = [TEST_HOME_ADDRESS, ...sampleUnique(TEST_METRO_CITY_HALL_ADDRESSES, 2)];

  const { data: insertedAddresses } = await serviceClient
    .from('addresses')
    .insert(
      addressesToSeed.map((address, index) => ({
        consumer_id: consumerId,
        label: address.label,
        recipient_name: '테스트 사용자',
        phone: '010-1234-5678',
        postal_code: address.postalCode,
        address_line1: address.addressLine1,
        address_line2: address.addressLine2,
        is_default: index === 0,
      })),
    )
    .select('id');

  const homeAddress = insertedAddresses?.[0];
  const products = await getAllProducts();

  if (!homeAddress || products.length === 0) {
    return;
  }

  for (const plan of TEST_ORDER_PLAN) {
    const product = pick(products);
    const pageCount = pick(PHOTOBOOK_PAGE_COUNT_OPTIONS);
    const quantity = randomInt(1, 3);
    const merchandiseAmount = (product.price + pageCount * PRICING.PRICE_PER_PAGE_KRW) * quantity;
    const shippingFee = calculateShippingFee(TEST_HOME_ADDRESS.postalCode, merchandiseAmount);

    const { data: insertedOrder } = await serviceClient
      .from('orders')
      .insert({
        consumer_id: consumerId,
        address_id: homeAddress.id,
        product_id: product.id,
        status: plan.status,
        title: generateRandomBookTitle(locale),
        page_count: pageCount,
        quantity,
        amount: merchandiseAmount + shippingFee,
      })
      .select('id')
      .single();

    if (!insertedOrder) {
      continue;
    }

    const photoRows = Array.from(
      { length: pageCount * PHOTOBOOK_PHOTOS_PER_PAGE },
      (_, photoIndex) => ({
        order_id: insertedOrder.id,
        storage_path: getRandomTestPhotoPath(),
        display_order: photoIndex,
      }),
    );
    await serviceClient.from('order_photos').insert(photoRows);

    if (plan.review) {
      await serviceClient.from('reviews').insert({
        order_id: insertedOrder.id,
        consumer_id: consumerId,
        rating: randomInt(4, 5),
        content: '인쇄 퀄리티가 정말 좋아요. 색감이 선명하게 나왔어요.',
      });
    }

    if (plan.simpleInquiry) {
      await seedInquiryThread(serviceClient, {
        consumerId,
        title: '제작 기간이 얼마나 걸리나요?',
        orderId: insertedOrder.id,
        messages: [
          {
            authorType: INQUIRY_MESSAGE_AUTHOR.CONSUMER,
            authorId: consumerId,
            content: '결제 완료 후 실제 배송까지 얼마나 걸리는지 궁금합니다.',
          },
        ],
      });
    }

    if (plan.threadInquiry) {
      await seedInquiryThread(serviceClient, {
        consumerId,
        title: '주문한 사진이 흐릿하게 인쇄될까 걱정돼요',
        orderId: insertedOrder.id,
        messages: [
          {
            authorType: INQUIRY_MESSAGE_AUTHOR.CONSUMER,
            authorId: consumerId,
            content: '업로드한 사진 해상도가 낮은 것 같은데 인쇄 품질에 문제없을까요?',
          },
          {
            authorType: INQUIRY_MESSAGE_AUTHOR.ADMIN,
            authorId: adminAuthorId,
            content:
              '업로드해주신 사진을 확인해본 결과 인쇄에 문제없는 해상도입니다. 안심하고 진행하셔도 됩니다.',
          },
          {
            authorType: INQUIRY_MESSAGE_AUTHOR.CONSUMER,
            authorId: consumerId,
            content: '안심이 되네요. 혹시 인쇄 시작 전에 한 번 더 확인해주실 수 있을까요?',
          },
        ],
      });
    }
  }
}
