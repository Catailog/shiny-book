import { createClient } from '@supabase/supabase-js';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SECRET_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    'NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY 환경변수가 필요합니다. --env-file=.env.local로 실행하세요.',
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const CONSUMER_ACCOUNTS = [
  {
    email: process.env.CONSUMER_SEED_EMAIL ?? 'consumer@shinybook.local',
    password: process.env.CONSUMER_SEED_PASSWORD ?? 'LocalConsumer1234!',
    phone: '010-1111-2222',
    addresses: [
      {
        label: '집',
        recipient_name: '김민준',
        address_line1: '서울특별시 중구 세종대로 110',
        address_line2: '서울특별시청',
        postal_code: '04524',
        is_default: true,
      },
      {
        label: '회사',
        recipient_name: '김민준',
        address_line1: '부산광역시 연제구 중앙대로 1001',
        address_line2: '부산광역시청',
        postal_code: '47545',
        is_default: false,
      },
      {
        label: '기타',
        recipient_name: '김민준',
        address_line1: '대전광역시 서구 둔산로 100',
        address_line2: '대전광역시청',
        postal_code: '35242',
        is_default: false,
      },
    ],
  },
  {
    email: process.env.CONSUMER_SEED_EMAIL_2 ?? 'consumer2@shinybook.local',
    password: process.env.CONSUMER_SEED_PASSWORD_2 ?? 'LocalConsumer2_1234!',
    phone: '010-3333-4444',
    addresses: [
      {
        label: '집',
        recipient_name: '이서연',
        address_line1: '인천광역시 남동구 정각로 29',
        address_line2: '인천광역시청',
        postal_code: '21554',
        is_default: true,
      },
      {
        label: '회사',
        recipient_name: '이서연',
        address_line1: '대구광역시 중구 공평로 88',
        address_line2: '대구광역시청',
        postal_code: '41909',
        is_default: false,
      },
      {
        label: '기타',
        recipient_name: '이서연',
        address_line1: '광주광역시 서구 상무중앙로 111',
        address_line2: '광주광역시청',
        postal_code: '61945',
        is_default: false,
      },
    ],
  },
];

const ORDER_STATUSES = ['awaiting_payment', 'paid', 'printing', 'binding', 'shipping'];
const PAGE_COUNT_OPTIONS = [8, 10, 12, 14, 16];
const PHOTOS_PER_PAGE = 2;
const PRICE_PER_PAGE_KRW = 5;
const SHIPPING_FEE_KRW = 3000;

const BOOK_TITLES = [
  '우리 가족의 여름',
  '제주도 3박4일',
  '아이의 첫 생일',
  '결혼 1주년 기념',
  '유럽 배낭여행',
  '반려견 콩이의 일기',
  '할머니와 보낸 여름',
  '신혼여행 in 발리',
  '태어난 지 100일',
  '캠퍼스 졸업앨범',
  '한강 러닝 클럽',
  '전주 한옥마을 나들이',
  '동해 바다 여행',
  '가족 캠핑 기록',
  '아기 돌잔치',
  '오사카 벚꽃 여행',
  '입사 1년의 기록',
  '친구들과 부산 여행',
  '겨울 스키장 추억',
  '텃밭 가꾸기 일기',
];

const REVIEWS_BY_RATING = {
  5: [
    '인쇄 퀄리티가 정말 좋아요. 색감이 선명하게 나왔어요.',
    '생각보다 훨씬 고급스러워요. 선물용으로 최고예요.',
    '제작 과정 안내도 친절하고 결과물도 만족스러워요.',
    '종이 재질이 두툼하고 튼튼해요. 재주문 의사 있습니다.',
    '배송도 빠르고 포장도 꼼꼼했어요. 추천합니다.',
  ],
  4: [
    '전체적으로 만족스러운데 배송이 조금 늦었어요.',
    '퀄리티는 좋은데 가격이 살짝 아쉬워요.',
    '색감이 살짝 다르게 나왔지만 만족합니다.',
    '제본 상태가 깔끔해요. 다음에도 이용할 것 같아요.',
  ],
  3: [
    '평범한 수준이었어요. 특별히 나쁘진 않아요.',
    '기대했던 것보다는 조금 아쉬웠어요.',
    '가격 대비 무난한 편입니다.',
  ],
  2: ['생각보다 종이 질이 얇았어요.', '색상이 화면과 다르게 인쇄됐어요.'],
  1: ['배송이 너무 오래 걸렸어요.', '제본이 약해서 페이지가 떨어졌어요.'],
};

const INQUIRY_TEMPLATES_GENERAL = [
  {
    title: '주문 취소는 어떻게 하나요?',
    content: '결제 후 바로 취소하고 싶은데 방법을 알려주세요.',
    reply:
      '마이페이지 주문 상세에서 결제완료 상태일 때 취소 요청이 가능합니다. 인쇄 시작 후에는 취소가 어려운 점 양해 부탁드립니다.',
  },
  {
    title: '회원 탈퇴 방법이 궁금해요',
    content: '더 이상 서비스를 이용하지 않을 것 같은데 탈퇴는 어디서 하나요?',
    reply:
      '마이페이지 > 계정 설정에서 탈퇴 신청이 가능합니다. 처리에 최대 3영업일이 소요될 수 있습니다.',
  },
  {
    title: '쿠폰이 적용되지 않아요',
    content: '보유한 쿠폰 코드를 입력했는데 할인이 적용되지 않습니다.',
    reply:
      '쿠폰 사용 기간과 최소 주문 금액을 확인 부탁드립니다. 확인 후에도 문제가 있다면 주문번호와 함께 다시 문의해주세요.',
  },
  {
    title: '적립금은 어떻게 쌓이나요?',
    content: '구매 시 적립금이 자동으로 쌓이는지 궁금합니다.',
    reply: null,
  },
];

const INQUIRY_TEMPLATES_ORDER = [
  {
    title: '주문한 사진이 흐릿하게 인쇄될까 걱정돼요',
    content: '업로드한 사진 해상도가 낮은 것 같은데 인쇄 품질에 문제없을까요?',
    reply:
      '업로드해주신 사진을 확인해본 결과 인쇄에 문제없는 해상도입니다. 안심하고 진행하셔도 됩니다.',
  },
  {
    title: '배송지를 변경하고 싶어요',
    content: '이미 결제한 주문의 배송지를 다른 주소로 바꾸고 싶습니다.',
    reply: '아직 배송 시작 전이라면 변경 가능합니다. 변경할 주소를 회신 부탁드립니다.',
  },
  {
    title: '제작 기간이 얼마나 걸리나요?',
    content: '결제 완료 후 실제 배송까지 얼마나 걸리는지 궁금합니다.',
    reply: '평균적으로 인쇄 3~5일, 제본 1~2일, 배송 1~2일 정도 소요됩니다.',
  },
  {
    title: '표지 색상을 변경할 수 있나요?',
    content: '주문 후에 표지 색상을 바꾸고 싶은데 가능한가요?',
    reply: null,
  },
];

const ANNOUNCEMENTS = {
  notice: [
    {
      title: '설 연휴 배송 일정 안내',
      content: '설 연휴 기간 중 주문 건은 연휴 이후 순차 발송됩니다.',
    },
    {
      title: '개인정보처리방침 개정 안내',
      content: '2026년 8월 1일부로 개인정보처리방침이 일부 개정되었습니다.',
    },
    {
      title: '서버 점검 안내',
      content: '더 나은 서비스를 위해 정기 점검을 진행합니다. 점검 중에는 주문이 제한됩니다.',
    },
    {
      title: '고객센터 운영시간 변경 안내',
      content: '고객센터 운영시간이 평일 오전 10시부터 오후 6시로 변경됩니다.',
    },
    {
      title: '결제 시스템 업데이트 안내',
      content: '보다 안전한 결제를 위해 결제 시스템을 업데이트했습니다.',
    },
  ],
  event: [
    {
      title: '여름맞이 포토북 15% 할인 이벤트',
      content: '전 상품 15% 할인 쿠폰을 지급해드립니다. 기간 내 사용해주세요.',
    },
    {
      title: '신규 회원 가입 축하 이벤트',
      content: '신규 가입 시 첫 주문에 사용 가능한 쿠폰을 드립니다.',
    },
    {
      title: '반려동물 포토북 특별 이벤트',
      content: '반려동물 사진으로 만드는 포토북을 특가로 만나보세요.',
    },
    { title: '친구 초대 이벤트', content: '친구를 초대하면 두 분 모두에게 할인 쿠폰을 드립니다.' },
    {
      title: '웨딩 시즌 프리미엄 앨범 이벤트',
      content: '웨딩 앨범 주문 시 고급 케이스를 무료로 증정합니다.',
    },
  ],
  winner: [
    {
      title: '여름맞이 이벤트 당첨자 발표',
      content: '여름맞이 포토북 이벤트에 참여해주신 모든 분께 감사드리며, 당첨자를 발표합니다.',
    },
    {
      title: '반려동물 포토북 이벤트 당첨자 발표',
      content: '많은 관심 감사드립니다. 당첨자분께는 개별 안내드렸습니다.',
    },
    {
      title: '친구 초대 이벤트 1차 당첨자 발표',
      content: '1차 친구 초대 이벤트 당첨자를 발표합니다.',
    },
    {
      title: '웨딩 앨범 이벤트 당첨자 발표',
      content: '웨딩 시즌 이벤트 당첨자를 발표합니다. 축하드립니다.',
    },
    {
      title: '신규 회원 이벤트 당첨자 발표',
      content: '신규 회원 가입 이벤트 당첨자를 발표합니다.',
    },
  ],
};

const FAQS = [
  {
    question: '포토북 제작 기간은 얼마나 걸리나요?',
    answer: '결제 완료 후 인쇄 3~5일, 제본 1~2일, 배송 1~2일로 평균 5~9일 소요됩니다.',
  },
  {
    question: '주문 후 사진을 다시 업로드할 수 있나요?',
    answer: '인쇄 시작 전이라면 고객센터 문의를 통해 사진 교체가 가능합니다.',
  },
  {
    question: '어떤 파일 형식을 지원하나요?',
    answer: 'JPG, PNG, WEBP 형식을 지원하며 파일당 최대 20MB까지 업로드 가능합니다.',
  },
  {
    question: '페이지 수는 최대 몇 페이지까지 가능한가요?',
    answer: '최소 8페이지부터 최대 16페이지까지 2페이지 단위로 선택 가능합니다.',
  },
  {
    question: '해외 배송도 가능한가요?',
    answer: '현재는 국내 배송만 지원하고 있으며, 해외 배송은 추후 지원 예정입니다.',
  },
  {
    question: '주문을 취소하고 싶어요.',
    answer:
      '결제완료 상태에서는 마이페이지에서 취소 요청이 가능하며, 인쇄 시작 후에는 취소가 어렵습니다.',
  },
  {
    question: '쿠폰은 어떻게 사용하나요?',
    answer: '주문서 작성 시 쿠폰 코드를 입력하면 할인 금액이 자동으로 적용됩니다.',
  },
  {
    question: '표지 재질은 어떤 종류가 있나요?',
    answer: '하드커버와 소프트커버 중 상품별로 선택하실 수 있습니다.',
  },
  {
    question: '인쇄 품질이 사진 원본과 다를 수 있나요?',
    answer:
      '모니터 환경에 따라 색감 차이가 있을 수 있으나, 최대한 원본과 유사하게 보정하여 인쇄합니다.',
  },
  {
    question: '반품/교환은 어떻게 하나요?',
    answer:
      '제작 특성상 단순 변심에 의한 반품은 어려우며, 제품 하자 시에는 전액 환불 또는 재제작이 가능합니다.',
  },
  {
    question: '결제 수단은 무엇을 지원하나요?',
    answer: '신용카드, 계좌이체, 간편결제를 지원합니다.',
  },
  {
    question: '적립금이나 회원 등급 혜택이 있나요?',
    answer: '현재는 별도의 회원 등급제 없이 이벤트성 쿠폰을 통해 혜택을 드리고 있습니다.',
  },
];

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysAgo(days) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function daysFromNow(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

async function ensureConsumer(email, password) {
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    throw new Error(listError.message);
  }

  const existing = existingUsers.users.find((user) => user.email === email);
  if (existing) {
    return existing.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.user.id;
}

async function deleteExistingDemoData() {
  console.log('기존 데이터 삭제 중...');

  const tables = [
    'inquiry_messages',
    'inquiries',
    'reviews',
    'order_photos',
    'print_jobs',
    'shipment_jobs',
    'orders',
    'addresses',
    'coupons',
    'announcements',
    'faqs',
  ];

  for (const table of tables) {
    const { error } = await supabase.from(table).delete().not('id', 'is', null);
    if (error) {
      throw new Error(`${table} 삭제 실패: ${error.message}`);
    }
  }

  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    throw new Error(listError.message);
  }

  for (const user of existingUsers.users) {
    if (user.app_metadata?.role === 'admin') {
      continue;
    }
    await supabase.auth.admin.deleteUser(user.id);
  }

  console.log('기존 데이터 삭제 완료');
}

async function seedCoupons() {
  console.log('쿠폰 시드 중...');

  const coupons = [
    {
      code: 'TEST10',
      discount_type: 'percentage',
      discount_value: 10,
      max_uses: null,
      is_active: true,
      starts_at: null,
      expires_at: null,
    },
    {
      code: 'EXPIRED1',
      discount_type: 'fixed',
      discount_value: 3000,
      max_uses: 100,
      is_active: true,
      starts_at: daysAgo(1825),
      expires_at: daysAgo(1460),
    },
    {
      code: 'EXPIRED2',
      discount_type: 'percentage',
      discount_value: 20,
      max_uses: 50,
      is_active: true,
      starts_at: daysAgo(1825),
      expires_at: daysAgo(1460),
    },
    {
      code: 'UPCOMING1',
      discount_type: 'fixed',
      discount_value: 5000,
      max_uses: 100,
      is_active: true,
      starts_at: daysFromNow(1825),
      expires_at: daysFromNow(3650),
    },
    {
      code: 'UPCOMING2',
      discount_type: 'percentage',
      discount_value: 15,
      max_uses: 100,
      is_active: true,
      starts_at: daysFromNow(1825),
      expires_at: daysFromNow(3650),
    },
    {
      code: 'ACTIVE1',
      discount_type: 'fixed',
      discount_value: 2000,
      max_uses: null,
      is_active: true,
      starts_at: daysAgo(365),
      expires_at: daysFromNow(1825),
    },
    {
      code: 'ACTIVE2',
      discount_type: 'percentage',
      discount_value: 5,
      max_uses: null,
      is_active: true,
      starts_at: daysAgo(365),
      expires_at: daysFromNow(1825),
    },
  ];

  const { error } = await supabase.from('coupons').insert(coupons);
  if (error) {
    throw new Error(`쿠폰 시드 실패: ${error.message}`);
  }

  return coupons;
}

async function seedAnnouncements() {
  console.log('공지/이벤트/당첨자 시드 중...');

  const rows = [];
  for (const [category, items] of Object.entries(ANNOUNCEMENTS)) {
    for (const item of items) {
      rows.push({ category, title: item.title, content: item.content });
    }
  }

  const { error } = await supabase.from('announcements').insert(rows);
  if (error) {
    throw new Error(`공지 시드 실패: ${error.message}`);
  }
}

async function seedFaqs() {
  console.log('FAQ 시드 중...');

  const { error } = await supabase.from('faqs').insert(FAQS);
  if (error) {
    throw new Error(`FAQ 시드 실패: ${error.message}`);
  }
}

async function main() {
  await deleteExistingDemoData();

  const { data: products, error: productError } = await supabase
    .from('products')
    .select('id, price');
  if (productError || !products || products.length === 0) {
    throw new Error('상품 목록을 불러오지 못했습니다.');
  }

  const availableCoupon = { code: 'TEST10' };
  const coupons = await seedCoupons();
  const alwaysUsableCoupon = coupons.find((coupon) => coupon.code === availableCoupon.code);
  const { data: couponRows } = await supabase.from('coupons').select('id, code');
  const alwaysUsableCouponId = couponRows.find((row) => row.code === alwaysUsableCoupon.code).id;

  await seedAnnouncements();
  await seedFaqs();

  const imagesDir = path.join(process.cwd(), '.claude', '.temp', 'random_images');
  const imageFiles = shuffle(await readdir(imagesDir));
  let imageCursor = 0;

  function nextImageFile() {
    const file = imageFiles[imageCursor % imageFiles.length];
    imageCursor += 1;
    return file;
  }

  for (const account of CONSUMER_ACCOUNTS) {
    console.log(`\n=== ${account.email} 시드 시작 ===`);
    const consumerId = await ensureConsumer(account.email, account.password);

    const addressRows = account.addresses.map((address) => ({
      consumer_id: consumerId,
      phone: account.phone,
      ...address,
    }));
    const { data: insertedAddresses, error: addressError } = await supabase
      .from('addresses')
      .insert(addressRows)
      .select('id');
    if (addressError) {
      throw new Error(`배송지 시드 실패: ${addressError.message}`);
    }

    const statusPlan = shuffle([
      ...ORDER_STATUSES.flatMap((status) => [status, status]),
      ...Array(10).fill('completed'),
    ]);

    const orderRows = [];
    for (let index = 0; index < statusPlan.length; index += 1) {
      const status = statusPlan[index];
      const product = pick(products);
      const address = pick(insertedAddresses);
      const pageCount = pick(PAGE_COUNT_OPTIONS);
      const quantity = randomInt(1, 3);
      const useCoupon = Math.random() < 0.5;
      const merchandiseAmount = (product.price + pageCount * PRICE_PER_PAGE_KRW) * quantity;
      const discount = useCoupon
        ? alwaysUsableCoupon.discount_type === 'percentage'
          ? Math.floor((merchandiseAmount * alwaysUsableCoupon.discount_value) / 100)
          : alwaysUsableCoupon.discount_value
        : 0;
      const amount = Math.max(merchandiseAmount - discount, 0) + SHIPPING_FEE_KRW;
      const createdAt = daysAgo(
        status === 'awaiting_payment' ? randomInt(0, 3) : randomInt(5, 150),
      );

      orderRows.push({
        consumer_id: consumerId,
        address_id: address.id,
        product_id: product.id,
        coupon_id: useCoupon ? alwaysUsableCouponId : null,
        status,
        title: pick(BOOK_TITLES),
        manuscript_file_url: null,
        cover_file_url: null,
        page_count: pageCount,
        quantity,
        amount,
        created_at: createdAt,
        updated_at: createdAt,
      });
    }

    const { data: insertedOrders, error: orderError } = await supabase
      .from('orders')
      .insert(orderRows)
      .select('id, status, consumer_id, created_at');
    if (orderError) {
      throw new Error(`주문 시드 실패: ${orderError.message}`);
    }

    for (let orderIndex = 0; orderIndex < insertedOrders.length; orderIndex += 1) {
      const order = insertedOrders[orderIndex];
      const orderRow = orderRows[orderIndex];
      const photoCount = orderRow.page_count * PHOTOS_PER_PAGE;
      const photoRows = [];

      for (let i = 0; i < photoCount; i += 1) {
        const fileName = nextImageFile();
        const buffer = await readFile(path.join(imagesDir, fileName));
        const storagePath = `${consumerId}/photo/seed-${order.id}-${i}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from('order-uploads')
          .upload(storagePath, buffer, { contentType: 'image/jpeg', upsert: true });
        if (uploadError) {
          throw new Error(`사진 업로드 실패: ${uploadError.message}`);
        }
        photoRows.push({ order_id: order.id, storage_path: storagePath, display_order: i });
      }

      const { error: photoError } = await supabase.from('order_photos').insert(photoRows);
      if (photoError) {
        throw new Error(`주문 사진 시드 실패: ${photoError.message}`);
      }
    }

    console.log(`주문 ${insertedOrders.length}건 + 사진 시드 완료`);

    const completedOrders = insertedOrders.filter((order) => order.status === 'completed');
    const reviewRows = [];
    for (const order of completedOrders) {
      if (Math.random() >= 0.8) {
        continue;
      }
      const rating = randomInt(1, 5);
      reviewRows.push({
        order_id: order.id,
        consumer_id: consumerId,
        rating,
        content: pick(REVIEWS_BY_RATING[rating]),
      });
    }
    if (reviewRows.length > 0) {
      const { error: reviewError } = await supabase.from('reviews').insert(reviewRows);
      if (reviewError) {
        throw new Error(`후기 시드 실패: ${reviewError.message}`);
      }
    }
    console.log(`후기 ${reviewRows.length}건 시드 완료`);

    const shuffledOrders = shuffle(insertedOrders);
    const orderInquiryTargets = shuffledOrders.slice(0, 6);
    const inquiryPlans = [
      ...orderInquiryTargets.map((order) => ({
        category: 'order',
        order_id: order.id,
        template: pick(INQUIRY_TEMPLATES_ORDER),
      })),
      ...Array.from({ length: 2 }, () => ({
        category: 'general',
        order_id: null,
        template: pick(INQUIRY_TEMPLATES_GENERAL),
      })),
    ];

    for (const plan of inquiryPlans) {
      const isAnswered = Boolean(plan.template.reply);
      const createdAt = daysAgo(randomInt(1, 90));
      const { data: inquiry, error: inquiryError } = await supabase
        .from('inquiries')
        .insert({
          consumer_id: consumerId,
          title: plan.template.title,
          category: plan.category,
          order_id: plan.order_id,
          answered_at: isAnswered ? daysAgo(randomInt(0, 1)) : null,
          created_at: createdAt,
          updated_at: createdAt,
        })
        .select('id')
        .single();
      if (inquiryError) {
        throw new Error(`문의 시드 실패: ${inquiryError.message}`);
      }

      const messages = [
        {
          inquiry_id: inquiry.id,
          author_type: 'consumer',
          author_id: consumerId,
          content: plan.template.content,
          created_at: createdAt,
          updated_at: createdAt,
        },
      ];
      if (isAnswered) {
        messages.push({
          inquiry_id: inquiry.id,
          author_type: 'admin',
          author_id: null,
          content: plan.template.reply,
          created_at: daysAgo(randomInt(0, 1)),
          updated_at: daysAgo(randomInt(0, 1)),
        });
      }

      const { error: messageError } = await supabase.from('inquiry_messages').insert(messages);
      if (messageError) {
        throw new Error(`문의 메시지 시드 실패: ${messageError.message}`);
      }
    }
    console.log(`문의 ${inquiryPlans.length}건 시드 완료`);
  }

  console.log('\n전체 시드 완료');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
