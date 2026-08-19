create table public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  size text not null,
  description text not null,
  price integer not null,
  image_url text not null,
  category text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.products enable row level security;

grant select, insert, update, delete on public.products to service_role;

insert into public.products (slug, name, size, description, price, image_url, category) values
  ('hardcover-photobook', '하드커버 포토북', '10 x 10 in', '견고한 보드 커버와 정밀한 마감으로 오래도록 보관하기 좋은 클래식한 하드커버 북입니다.', 990, '/images/products/hardcover-photobook.png', 'classic'),
  ('softcover-photobook', '소프트커버 포토북', '8 x 10 in', '가볍고 부드러운 커버로 제작해 매일 편하게 넘겨보기 좋은 데일리 기록용 북입니다.', 790, '/images/products/softcover-photobook.png', 'classic'),
  ('premium-photo-album', '프리미엄 포토 앨범', '12 x 12 in', '고급 레더 커버와 두툼한 보존용 용지로 완성하는 가장 특별한 소장용 앨범입니다.', 9900, '/images/products/premium-photo-album.png', 'premium'),
  ('travel-journal', '여행 저널', '6 x 8 in', '휴대하기 좋은 아담한 사이즈로, 여행의 순간과 감상을 기록하기 좋은 저널입니다.', 690, '/images/products/travel-journal.png', 'classic'),
  ('wedding-album', '웨딩 앨범', '11 x 14 in', '인생에서 가장 빛나는 순간을 우아하게 담아내는 웨딩 전용 앨범입니다.', 9900, '/images/products/wedding-album.png', 'premium'),
  ('babys-first-year', '베이비 앨범', '9 x 9 in', '아기의 첫 1년, 소중한 성장 기록을 사랑스럽게 담아내는 앨범입니다.', 8900, '/images/products/babys-first-year.png', 'premium');
