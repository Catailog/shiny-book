-- Lets the reference-data seed script (scripts/seed-reference-data.mjs) upsert by
-- a stable key instead of the editable question text, so re-running it against a
-- server that already has these rows updates them in place instead of duplicating.
-- Nullable: FAQs created through the admin UI have no slug and are unaffected.
alter table public.faqs
  add column slug text unique;

update public.faqs set slug = 'production-time'
  where question = '포토북 제작 기간은 얼마나 걸리나요?';
update public.faqs set slug = 'reupload-photos'
  where question = '주문 후 사진을 다시 업로드할 수 있나요?';
update public.faqs set slug = 'file-formats'
  where question = '어떤 파일 형식을 지원하나요?';
update public.faqs set slug = 'page-count-range'
  where question = '페이지 수는 최대 몇 페이지까지 가능한가요?';
update public.faqs set slug = 'international-shipping'
  where question = '해외 배송도 가능한가요?';
update public.faqs set slug = 'order-cancellation'
  where question = '주문을 취소하고 싶어요.';
update public.faqs set slug = 'coupon-usage'
  where question = '쿠폰은 어떻게 사용하나요?';
update public.faqs set slug = 'cover-materials'
  where question = '표지 재질은 어떤 종류가 있나요?';
update public.faqs set slug = 'print-quality-variance'
  where question = '인쇄 품질이 사진 원본과 다를 수 있나요?';
update public.faqs set slug = 'returns-exchanges'
  where question = '반품/교환은 어떻게 하나요?';
update public.faqs set slug = 'payment-methods'
  where question = '결제 수단은 무엇을 지원하나요?';
update public.faqs set slug = 'loyalty-program'
  where question = '적립금이나 회원 등급 혜택이 있나요?';
