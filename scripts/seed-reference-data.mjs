import { createClient } from '@supabase/supabase-js';

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

const COUPONS = [
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

  console.log(`공지/이벤트/당첨자 ${rows.length}건 시드 완료`);
}

async function seedFaqs() {
  console.log('FAQ 시드 중...');

  const { error } = await supabase.from('faqs').insert(FAQS);
  if (error) {
    throw new Error(`FAQ 시드 실패: ${error.message}`);
  }

  console.log(`FAQ ${FAQS.length}건 시드 완료`);
}

async function seedCoupons() {
  console.log('쿠폰 시드 중...');

  const { error } = await supabase.from('coupons').insert(COUPONS);
  if (error) {
    throw new Error(`쿠폰 시드 실패: ${error.message}`);
  }

  console.log(`쿠폰 ${COUPONS.length}건 시드 완료`);
}

async function main() {
  await seedAnnouncements();
  await seedFaqs();
  await seedCoupons();

  console.log('\n참조 데이터 시드 완료');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
