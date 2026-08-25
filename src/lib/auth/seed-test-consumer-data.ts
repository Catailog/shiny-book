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
  answeredInquiry: boolean;
  review: boolean;
}

const TEST_REVIEW_MESSAGES: readonly string[] = [
  '인쇄 퀄리티가 정말 좋아요. 색감이 선명하게 나왔어요.',
  '생각보다 훨씬 고급스러워요. 선물용으로 최고예요.',
  '제작 과정 안내도 친절하고 결과물도 만족스러워요.',
  '종이 재질이 두툼하고 튼튼해요. 재주문 의사 있습니다.',
  '배송도 빠르고 포장도 꼼꼼했어요. 추천합니다.',
  '전체적으로 만족스러운데 배송이 조금 늦었어요.',
  '퀄리티는 좋은데 가격이 살짝 아쉬워요.',
  '색감이 살짝 다르게 나왔지만 만족합니다.',
  '제본 상태가 깔끔해요. 다음에도 이용할 것 같아요.',
  '거실 선반에 세워두기만 해도 인테리어 오브제가 되네요.',
  '사철 제본 덕분에 180도로 시원하게 펴져서 사진이 더 예뻐 보여요.',
  '레이아웃 템플릿이 군더더기 없고 여백이 조화로워요.',
  '아이 사진을 이렇게 예쁘게 남길 수 있어서 감사해요.',
  '표지 재질이 손에 착 감기고 고급스러워요.',
  '여행 사진을 한 권으로 묶으니 보는 재미가 배가 됐어요.',
  '인쇄 색감이 실제 사진이랑 거의 똑같이 나왔어요.',
  '제작 기간도 안내받은 대로 정확히 지켜졌어요.',
  '포장 상태가 꼼꼼해서 배송 중 손상 걱정이 없었어요.',
  '페이지 넘김이 부드럽고 제본이 단단해서 오래 볼 수 있을 것 같아요.',
  '가족 행사 앨범으로 만들었는데 다들 좋아하셨어요.',
];

const TEST_INQUIRY_WITHOUT_ANSWER: readonly { title: string; content: string }[] = [
  {
    title: '제작 기간이 얼마나 걸리나요?',
    content: '결제 완료 후 실제 배송까지 얼마나 걸리는지 궁금합니다.',
  },
  {
    title: '배송지를 변경하고 싶어요',
    content: '이미 결제한 주문의 배송지를 다른 주소로 바꾸고 싶습니다.',
  },
  {
    title: '표지 색상을 변경할 수 있나요?',
    content: '주문 후에 표지 색상을 바꾸고 싶은데 가능한가요?',
  },
  {
    title: '적립금은 어떻게 쌓이나요?',
    content: '구매 시 적립금이 자동으로 쌓이는지 궁금합니다.',
  },
  {
    title: '주문 취소는 어떻게 하나요?',
    content: '결제 후 바로 취소하고 싶은데 방법을 알려주세요.',
  },
  {
    title: '페이지 수를 늘릴 수 있나요?',
    content: '이미 결제한 주문에서 페이지 수를 더 늘리고 싶습니다.',
  },
  {
    title: '해외 배송도 가능한가요?',
    content: '해외에 있는 가족에게 선물하고 싶은데 배송이 가능한지 궁금합니다.',
  },
  {
    title: '사진 파일을 잘못 올렸어요',
    content: '주문 후에 다른 순서로 사진이 들어간 것 같은데 수정 가능한가요?',
  },
  {
    title: '동일한 주소로 여러 권 배송 가능한가요?',
    content: '같은 주소로 두 권을 각각 다른 포장으로 받고 싶습니다.',
  },
  {
    title: '영수증 발급이 가능한가요?',
    content: '회사 경비 처리를 위해 현금영수증 발급이 가능한지 궁금합니다.',
  },
];

const TEST_INQUIRY_WITH_ANSWER: readonly { title: string; content: string; reply: string }[] = [
  {
    title: '주문한 사진이 흐릿하게 인쇄될까 걱정돼요',
    content: '업로드한 사진 해상도가 낮은 것 같은데 인쇄 품질에 문제없을까요?',
    reply:
      '업로드해주신 사진을 확인해본 결과 인쇄에 문제없는 해상도입니다. 안심하고 진행하셔도 됩니다.',
  },
  {
    title: '결제 후 배송 조회는 어디서 하나요?',
    content: '결제는 완료했는데 배송 조회를 어디서 할 수 있는지 모르겠어요.',
    reply: '마이페이지 > 주문내역에서 현재 제작/배송 상태를 확인하실 수 있습니다.',
  },
  {
    title: '쿠폰이 적용되지 않아요',
    content: '보유한 쿠폰 코드를 입력했는데 할인이 적용되지 않습니다.',
    reply:
      '쿠폰 사용 기간과 최소 주문 금액을 확인 부탁드립니다. 확인 후에도 문제가 있다면 다시 문의해주세요.',
  },
  {
    title: '제작 중 페이지 순서를 바꿀 수 있나요?',
    content: '인쇄가 시작되기 전이라면 페이지 순서를 바꿀 수 있는지 궁금합니다.',
    reply: '인쇄 시작 전이라면 가능합니다. 원하시는 순서를 알려주시면 반영해드리겠습니다.',
  },
  {
    title: '표지 재질 차이가 궁금해요',
    content: '하드커버와 소프트커버의 실제 질감 차이가 궁금합니다.',
    reply:
      '하드커버는 각진 양장 제본, 소프트커버는 부드러운 무선 제본으로 손에 쥐는 느낌이 다릅니다.',
  },
  {
    title: '분실된 것 같은데 확인 부탁드려요',
    content: '배송 완료로 떴는데 아직 못 받았습니다. 확인 부탁드립니다.',
    reply:
      '택배사에 배송 상태를 확인 중이며, 확인되는 대로 안내드리겠습니다. 불편을 드려 죄송합니다.',
  },
  {
    title: '재주문 시 이전 디자인을 그대로 쓸 수 있나요?',
    content: '지난번 주문한 앨범을 동일한 구성으로 한 권 더 만들고 싶어요.',
    reply: '이전 주문번호를 알려주시면 동일한 구성으로 재주문을 도와드리겠습니다.',
  },
  {
    title: '색감이 화면과 다르게 나왔어요',
    content: '받아본 인쇄물 색감이 화면에서 보던 것과 조금 다릅니다.',
    reply:
      '모니터 환경에 따라 색감 차이가 있을 수 있어 최대한 원본과 유사하게 보정 후 인쇄하고 있습니다.',
  },
  {
    title: '제본이 약한 것 같아요',
    content: '받은 책의 제본 부분이 살짝 헐거운 느낌이 듭니다.',
    reply:
      '불편을 드려 죄송합니다. 사진과 주문번호를 남겨주시면 재제작 또는 환불을 도와드리겠습니다.',
  },
  {
    title: '증정용 케이스도 같이 오나요?',
    content: '프리미엄 상품 주문 시 케이스가 기본으로 포함되는지 궁금합니다.',
    reply: '프리미엄 상품은 기본 케이스가 포함되어 함께 배송됩니다.',
  },
];

const TEST_ORDER_PLAN: readonly TestOrderPlanItem[] = [
  {
    status: ORDER_STATUS.AWAITING_PAYMENT,
    threadInquiry: false,
    simpleInquiry: false,
    answeredInquiry: false,
    review: false,
  },
  {
    status: ORDER_STATUS.PRINTING,
    threadInquiry: true,
    simpleInquiry: false,
    answeredInquiry: false,
    review: false,
  },
  {
    status: ORDER_STATUS.BINDING,
    threadInquiry: false,
    simpleInquiry: false,
    answeredInquiry: true,
    review: false,
  },
  {
    status: ORDER_STATUS.SHIPPING,
    threadInquiry: false,
    simpleInquiry: false,
    answeredInquiry: false,
    review: false,
  },
  {
    status: ORDER_STATUS.COMPLETED,
    threadInquiry: false,
    simpleInquiry: true,
    answeredInquiry: false,
    review: false,
  },
  {
    status: ORDER_STATUS.COMPLETED,
    threadInquiry: false,
    simpleInquiry: false,
    answeredInquiry: false,
    review: true,
  },
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
        content: pick(TEST_REVIEW_MESSAGES),
      });
    }

    if (plan.simpleInquiry) {
      const inquiry = pick(TEST_INQUIRY_WITHOUT_ANSWER);
      await seedInquiryThread(serviceClient, {
        consumerId,
        title: inquiry.title,
        orderId: insertedOrder.id,
        messages: [
          {
            authorType: INQUIRY_MESSAGE_AUTHOR.CONSUMER,
            authorId: consumerId,
            content: inquiry.content,
          },
        ],
      });
    }

    if (plan.answeredInquiry) {
      const inquiry = pick(TEST_INQUIRY_WITH_ANSWER);
      await seedInquiryThread(serviceClient, {
        consumerId,
        title: inquiry.title,
        orderId: insertedOrder.id,
        messages: [
          {
            authorType: INQUIRY_MESSAGE_AUTHOR.CONSUMER,
            authorId: consumerId,
            content: inquiry.content,
          },
          {
            authorType: INQUIRY_MESSAGE_AUTHOR.ADMIN,
            authorId: adminAuthorId,
            content: inquiry.reply,
          },
        ],
      });
    }

    if (plan.threadInquiry) {
      const inquiry = pick(TEST_INQUIRY_WITH_ANSWER);
      await seedInquiryThread(serviceClient, {
        consumerId,
        title: inquiry.title,
        orderId: insertedOrder.id,
        messages: [
          {
            authorType: INQUIRY_MESSAGE_AUTHOR.CONSUMER,
            authorId: consumerId,
            content: inquiry.content,
          },
          {
            authorType: INQUIRY_MESSAGE_AUTHOR.ADMIN,
            authorId: adminAuthorId,
            content: inquiry.reply,
          },
          {
            authorType: INQUIRY_MESSAGE_AUTHOR.CONSUMER,
            authorId: consumerId,
            content:
              '그런데 실제로 인쇄되기 전에 완성된 모습을 미리 확인해볼 수 있는 방법이 있을까요? 직접 보고 안심하고 싶어서요.',
          },
        ],
      });
    }
  }
}
