import type { ReviewWithOrderTitle } from '@/lib/reviews/get-reviews';

export const MOCK_REVIEWS: ReviewWithOrderTitle[] = [
  {
    id: 'mock-review-1',
    consumer_id: 'mock-consumer-1',
    order_id: 'mock-order-1',
    orderTitle: 'Wedding Album',
    rating: 5,
    content:
      '결혼식 사진들을 일반 인화 앨범 대신 실크 양장본으로 제작했는데, 거실 선반에 세워두기만 해도 하나의 인테리어 오브제가 되네요. 종이 감촉이 너무 고급스럽고 마감이 정교합니다.',
    created_at: '2026-02-10T00:00:00.000Z',
    updated_at: '2026-02-10T00:00:00.000Z',
  },
  {
    id: 'mock-review-2',
    consumer_id: 'mock-consumer-2',
    order_id: 'mock-order-2',
    orderTitle: 'Travel Journal',
    rating: 5,
    content:
      '아이와의 3주간의 유럽 여행을 책 한 권에 모았습니다. 사철 제본 덕분에 180도로 시원하게 펴져 파노라마 풍경 사진도 완벽하게 살릴 수 있었네요.',
    created_at: '2026-02-04T00:00:00.000Z',
    updated_at: '2026-02-04T00:00:00.000Z',
  },
  {
    id: 'mock-review-3',
    consumer_id: 'mock-consumer-3',
    order_id: 'mock-order-3',
    orderTitle: "Baby's First Year",
    rating: 4,
    content:
      '아기의 첫 1년을 기록한 성장 앨범인데 너무 마음에 들어요. 레이아웃 템플릿이 군더더기 없고 여백이 조화로워서 클래식한 화보집 같은 분위기가 연출됩니다.',
    created_at: '2026-01-28T00:00:00.000Z',
    updated_at: '2026-01-28T00:00:00.000Z',
  },
];
