# Shiny Book

**Live Demo**: [shiny-book.vercel.app](https://shiny-book.vercel.app/)

- 사진을 인화해 포토북으로 제작해주는 온라인 주문 제작 서비스입니다. 소비자용 주문/결제 플로우와 관리자용 상품/주문/문의 관리 대시보드를 함께 제공합니다.
- 본 프로젝트에서는 간단히 테스트해볼 수 있도록 테스트 계정 자동 로그인, 폼 자동 입력 등의 기능들이 추가되어 있습니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Database / Auth / Storage**: Supabase
- **UI**: Tailwind CSS 4, Shadcn UI, Radix (Base UI), Lucide React
- **상태 관리**: Zustand, TanStack Query, React Hook Form, nuqs
- **검증**: Zod
- **결제**: 토스페이먼츠
- **Rate Limiting**: Upstash Ratelimit / Redis
- **테스트**: Vitest, Playwright

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 만들고 아래 값을 채워주세요. 실제 값은 Supabase 프로젝트, Toss Payments, Upstash 콘솔에서 발급받습니다.

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=

# Upstash Redis (Rate limiting)
KV_REST_API_URL=
KV_REST_API_TOKEN=

# 토스페이먼츠
NEXT_PUBLIC_TOSS_CLIENT_KEY=
TOSS_SECRET_KEY=

# 로컬 테스트 관리자 계정 (선택, 기본값 있음)
ADMIN_SEED_EMAIL=
ADMIN_SEED_PASSWORD=
```

### 3. 로컬 Supabase 실행

```bash
npx supabase start
```

`supabase/migrations`에 정의된 스키마가 자동으로 적용됩니다.

### 4. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 에서 확인할 수 있습니다.

## 주요 스크립트

| 명령어                            | 설명                                         |
| --------------------------------- | -------------------------------------------- |
| `npm run dev`                     | 개발 서버 실행                               |
| `npm run build`                   | 프로덕션 빌드                                |
| `npm run start`                   | 빌드 결과 실행                               |
| `npm run lint`                    | ESLint 검사                                  |
| `npm run type-check`              | 타입 체크                                    |
| `npm run format`                  | Prettier로 포맷팅                            |
| `npm run test`                    | Vitest 단위 테스트 실행                      |
| `npm run e2e`                     | Playwright E2E 테스트 실행                   |
| `npm run db:types`                | 로컬 Supabase 스키마로 타입 재생성           |
| `npm run db:seed-admin`           | 로컬 관리자 계정 시드                        |
| `npm run db:seed-test-photo-pool` | 테스트 로그인/사진 채우기용 이미지 풀 업로드 |

## 브랜치 전략

모든 작업은 `dev` 브랜치에서 진행합니다. `main`은 검증이 끝난 상태만 유지하는 보호 브랜치이며, `dev` -> `main`은 PR을 통해서만 병합합니다. PR에서 CI(타입체크/린트/테스트/빌드)를 모두 통과해야 병합할 수 있습니다.
