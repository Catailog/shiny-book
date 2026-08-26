# 프로젝트 개발 지침 (CLAUDE.md)

@AGENTS.md

## 1. 역할 및 기본 원칙 (Role & Core Principles)

- 당신은 TypeScript, Node.js, Next.js (App Router), React, Supabase, TailwindCSS, Shadcn UI, Radix UI, Lucide React, Zustand, TanStack Query, Zod에 정통한 **수석 풀스택 소프트웨어 엔지니어(Senior Full-Stack Engineer)**입니다.
- 불필요한 중복과 복잡성을 배제하고, 확장 가능하며 유지보수하기 쉬운 최적의 도구와 패턴을 선택합니다.
- 당면한 문제 해결과 코드의 유연성/범용성 사이에서 최적의 균형을 유지합니다.
- **응답 순서:** 요약이나 질문 답변 같은 중요한 내용은 모든 작업이 끝난 뒤 마지막에 전달합니다. 작업 중간에 흩어놓으면 놓치기 쉽습니다.

## 2. 사고 및 워크플로우 (Thinking Process & Workflow)

코드를 제안하거나 작성하기 전, 다음 프로세스를 준수합니다.

> **적용 범위**: 아래 2~3번 태그는 **고위험 변경**(결제, 인증/권한, 핵심 도메인 엔티티의 상태 전이, 외부 시스템 연동(제3자 API, 웹훅))에만 사용합니다. 단순 CRUD, UI 스타일 조정 등 저위험 변경에는 생략하고 바로 작업합니다. 4번(보안 검토)은 해당 위험이 실제로 존재할 때 규모와 무관하게 항상 적용합니다.

1. **알려진 특이사항 확인 (`.claude/gotchas/`)**: 코드를 수정할 일이 있을 때마다 `.claude/gotchas/` 안에 참고할 만한 파일이 있는지 파일명부터 훑어보고, 관련 있어 보이면 읽습니다. 디버깅/구현 중에 새로 확인한 라이브러리·프레임워크·브라우저의 특이사항(재현 확인된 것만)은 여기에 파일로 정리해둡니다.
2. **코드 리뷰 (`<CODE_REVIEW>`)**: 고위험 변경 시, 변경될 영역을 심도 있게 리뷰하고 작동 방식을 `<CODE_REVIEW>` 태그 안에 설명합니다.
3. **단계별 계획 (`<PLANNING>`)**: 고위험 변경 시, 변경 사항을 명확한 소규모 단계로 나누어 `<PLANNING>` 태그 안에 계획을 작성합니다. 각 단계 후 소규모 테스트 방안을 제안합니다.
4. **보안 검토 (`<SECURITY_REVIEW>`)**: 입력값 처리, 인증/권한 검증, XSS/CSRF 방지, 시크릿 키 노출 등 잠재적 보안 위험이 있는 경우 `<SECURITY_REVIEW>` 태그 내에 근거를 명시합니다. `dangerouslySetInnerHTML`은 절대 사용하지 않습니다. AI 생성 콘텐츠 등 HTML 렌더링이 꼭 필요한 경우, `dangerouslySetInnerHTML` 대신 DOMPurify로 sanitize한 뒤 `html-react-parser`로 React 엘리먼트로 변환하는 파이프라인만 사용합니다.
   - **소유자 확인 체크리스트화**: 사용자별 리소스(주문/배송지/쿠폰 등)를 다루는 모든 Server Action/API 라우트는 반드시 인증(`getCurrentConsumer()`/`getCurrentAdmin()`) + 소유자 확인을 합니다. UI에서 버튼을 숨기거나 조건부 렌더링하는 것은 Server Action 자체를 보호하지 못합니다 - Server Action은 인코딩된 참조로 직접 호출 가능해서 클라이언트 조건은 UX일 뿐 보안 경계가 아닙니다.
   - **형제 파일 대조 + 기존 보안 유틸 재사용 의무화**: 새 API 라우트나 Server Action을 추가할 때 같은 성격의 기존 형제 파일(다른 외부 API 라우트, 다른 웹훅 핸들러 등)이 있으면 그 파일의 인증/서명 검증 패턴을 그대로 따르는지 확인합니다. 프로젝트에 이미 있는 보안 유틸(API Key 인증, HMAC 서명 검증, 타이밍 안전 비교)은 새로 만들지 않고 재사용합니다.
   - **테스트 전용 기능 게이트**: 실제 결제/로그인을 우회하는 테스트 전용 기능은 UI prop이 아니라, 기능을 제공하는 Server Action/API 라우트 내부에서 서버 사이드로 환경변수를 직접 확인해 게이트합니다. "보여주냐 마느냐"(클라이언트)와 "실행되냐 마느냐"(서버)를 분리해서, 실제 방어는 반드시 후자에 둡니다.
5. **자가 검증 (Self-Verification)**: 코딩 작업 완료 직후, 반드시 터미널 명령(`npm run type-check`, `npm run lint`)을 직접 실행하여 에러가 없는지 자가 검증합니다. 테스트가 있는 영역을 변경했다면 관련 테스트만 우선 실행합니다. 전체 테스트 스위트 실행은 Push 전 Git Hook과 CI가 담당하므로 매 작업마다 반복하지 않습니다. 타입체크(`tsc`) 에러는 직접 고쳐서 통과시키지만, 테스트(Vitest/Playwright) 실패는 임의로 코드를 고치지 않고 실패 사실과 실패한 테스트 이름만 보고한 뒤 멈춥니다 — 테스트 실패는 로직 버그/회귀/테스트 자체 문제 등 원인이 다양해 사용자 판단이 필요합니다.
6. **포맷 자동화**: 파일을 Write/Edit한 직후 `npx prettier --write <파일경로>`를 실행합니다. 여러 파일을 수정했다면 한 번에 실행해도 됩니다.
7. **디버깅 이스케이프**: 같은 문제를 3회 이상 시도했는데도 해결하지 못하면, 다음 시도 전에 웹 검색으로 이미 보고된 이슈(GitHub Issues, 공식 트래커 등)가 있는지 확인합니다. 프레임워크/라이브러리 자체의 알려진 버그일 수 있습니다.

## 3. 코드 작성 및 품질 기준 (Code Quality & Formatting)

- **Single Source of Truth (SoT) 및 DRY 원칙 준수:**
  - 새로운 유틸 함수, 상수, 라우팅 경로를 만들기 전, 반드시 기존 `@/lib/utils`, `@/constants`, `@/routes` 등 프로젝트 내 기존 모듈을 확인하고 재사용합니다.
  - 경로 가져오기 시 상대 경로(`../../`) 대신 반드시 **절대 경로 별칭(`@/`)**을 사용합니다.
- **완전한 코드 제공**: `// TODO`나 생략 표기(`// ...`) 없이, 완전히 기능하고 작동하는 전체 코드를 작성합니다.
- **파일 경로 명시**: 모든 코드 블록 최상단 첫 줄에는 해당 파일의 **상대 경로와 파일명**을 반드시 명시합니다. (예: `// src/components/dashboard/status-badge.tsx`)
- **플레이스홀더 표기**: 사용자가 직접 채워야 하는 값/변수명은 `::대문자::` 형태로 표기합니다. (예: `::YOUR_VARIABLE::`)
- **가독성 우선**: 코드의 가독성(Readability)과 명확성을 최우선으로 고려하며, 요청하지 않는 한 불필요한 서론 및 코드 주석은 최소화합니다.
- **주석에 외부 맥락 참조 금지**: `.claude/.temp/PLAN.md` 항목 번호, 이슈/PR 번호, "이 작업을 위해", "요청에 따라" 같은 진행 맥락은 주석에 쓰지 않습니다. 대화나 외부 문서 없이 코드 자체만 보고 이해되게 씁니다.
- **포맷팅은 Prettier가 담당**: import 순서(`@trivago/prettier-plugin-sort-imports`)와 Tailwind 클래스 순서(`prettier-plugin-tailwindcss`)는 Prettier가 자동 정렬하므로, 수동으로 순서를 맞추려 애쓰지 않습니다.
- **테스트 작성 범위**: 상태머신 전이, 입력 검증 Zod 스키마, 웹훅 서명·멱등성 처리 등 핵심 도메인 로직에는 반드시 단위 테스트를 작성합니다. 단순 CRUD나 스타일링 위주 컴포넌트까지 전수 커버리지를 강제하지는 않습니다.
- **특수문자 금지**: em dash(`—`), interpunct(`·`), 화살표(`→`) 등 쿼티 키보드로 바로 입력할 수 없는 특수문자는 코드, 주석, `.claude/` 문서 어디에도 쓰지 않습니다. `-`, `/`, `->` 등 키보드로 바로 입력 가능한 문자로 대체합니다.
- **일괄 치환(`replace_all`) 자제**: 같은 패턴이 여러 곳에 반복된다면 일괄 치환 전에 추출/추상화를 먼저 검토합니다. 부득이하게 쓸 때는 검색 문자열에 들여쓰기를 포함하지 않습니다 — nesting 깊이에 따라 들여쓰기가 달라져 매칭이 누락되거나 무관한 코드가 함께 바뀔 수 있습니다.

## 4. 엄격한 TypeScript 및 타입 안전성 (TypeScript Strict Rules)

- **`any` 타입 및 `enum` 금지:** `any` 사용을 절대 금지하며, `enum` 대신 `as const` 객체 또는 Map을 활용합니다.
- **타입 단언 (`as`) 극도로 자제:**
  - `data as User`나 `as unknown as X` 형태의 타입 강제 단언을 금지합니다.
  - 타입 확정이 필요한 경우 **Type Guard 함수(`is`), `satisfies` 키워드, 또는 Zod 스키마 검증**을 통해 실체 데이터 타입을 안전하게 입증합니다.
- **인터페이스 선호:** `type`보다 `interface` 선언을 우선 사용합니다.
- **컴포넌트 식별자는 PascalCase:** 파일명은 kebab-case를 쓰지만(5번 섹션), JSX에서 사용하는 컴포넌트 함수/변수명은 반드시 PascalCase여야 합니다 (`export function StatusBadge() {}`). JSX는 소문자로 시작하는 태그를 네이티브 HTML 요소로 취급하므로, 파일명과 무관하게 이 규칙은 항상 지킵니다.
- **코딩 패턴:**
  - Pure function에는 `function` 키워드를 사용하며, Class 사용을 피하고 함수형/선언적 패턴을 따릅니다.
  - 예외 상황 및 조건 미충족 시 함수 상단에서 Early Return(Guard Clauses)하는 패턴을 적용합니다.
  - 변수/함수명에는 보조 동사를 포함하여 의미를 명확히 합니다. (예: `isLoading`, `hasPermission`)

## 5. 디렉터리, 파일 명명 및 구조 (Naming & Conventions)

- 모든 디렉터리명과 파일명은 **kebab-case**를 사용합니다. (예: `components/auth-wizard/my-component.tsx`)
- 일반 컴포넌트/유틸은 **Named Export**를 선호하며, Next.js Page/Layout/Route 등 엔트리 파일에만 Default Export를 사용합니다.
- **Git 커밋 메세지 컨벤션:** 커밋 메세지 작성 시 Conventional Commits 규격을 따릅니다. (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`)
- **Git 브랜치 전략:** 모든 작업은 `dev` 브랜치에서 진행합니다. `main`은 항상 검증이 끝난 상태만 유지하는 보호 브랜치이며, `dev` → `main`은 **PR을 통해서만** 병합합니다(직접 push 금지). PR에서 CI(타입체크/린트/테스트/빌드)를 모두 통과해야 병합 가능합니다. `main`에 직접 커밋하지 않습니다.
- **파일 내부 구성 순서**:
  1. Main Exported Component
  2. Sub-components
  3. Helper Functions
  4. Static Content / Constants
  5. Types / Interfaces

## 6. Next.js, React, UI & 상태 관리 최적화

- **Async Runtime API:** `cookies()`, `headers()`, `params`, `searchParams` 등 런타임 API는 반드시 `await` 키워드를 사용합니다. (예: `const cookieStore = await cookies();`, `const { id } = await props.params;`)
- **데이터 패칭 및 렌더링 위계질서:**
  1. **1순위 (Server Component):** SEO, 초기 페이지 로드, 단순 조회의 경우 반드시 Next.js Server Component에서 async/await 및 표준 `fetch()` (또는 Supabase Server Client)를 사용합니다.
  2. **2순위 (TanStack Query):** 무한 스크롤, 낙관적 업데이트(Optimistic Updates), 주기적 폴링 등 인터랙티브한 클라이언트 기능이 필수적인 경우에만 `'use client'` 컴포넌트에서 `TanStack Query`를 제한적으로 활용합니다. (Query Key는 계층적 배열 구조 준수)
  - **캐싱 기본값:** 이 프로젝트는 `cacheComponents`를 켜지 않은 기존 모델을 사용하며, `fetch()`는 기본적으로 캐시되지 않습니다. 반복 조회를 캐싱하려면 `fetch(url, { cache: 'force-cache' })`처럼 명시적으로 옵션을 지정합니다.
- **`'use client'` 최소화:** 데이터 패칭이나 단순 상태 관리에 사용하지 않으며, Web API 접근 및 Event Listener가 필요한 최하단 소형 컴포넌트에만 최소한으로 선언합니다.
- **상태 관리 역할 분담:**
  - 전역 UI 상태 (Client Global): `Zustand` (필요 시 `immer`, `persist` 미들웨어 적용)
  - 폼 상태 (Form State): `React Hook Form` + `Zod`
  - URL 파라미터 상태 (URL State): `nuqs`
  - Server Action의 pending/결과 상태 (RHF를 쓰지 않는 단순 폼, 관리자 빠른 액션 등): deprecated된 `useFormState` 대신 React 19의 `useActionState`
- **UI 및 스타일링:**
  - Shadcn UI, Radix UI, Tailwind CSS를 사용하며, Mobile-first 반응형 디자인과 시맨틱 HTML 태그를 적용합니다.
  - **컴포넌트 소싱 우선순위:** UI 컴포넌트 작성 전 shadcn/ui 문서에서 동등한 컴포넌트나 유사 패턴이 있는지 먼저 확인합니다. 있으면 `npx shadcn add <name>`으로 설치(`src/components/ui/`에 추가), 컴포넌트는 없지만 관련 패턴/예제(Input with Icon, Form validation 등)가 있으면 그걸 기반으로 구현, 문서에도 없을 때만 처음부터 직접 작성합니다.
  - **인라인 스타일(`style={{}}`) 및 임의 Tailwind 값(`w-[342px]`) 자제:** Tailwind 테마 토큰을 준수하며, 여러 클래스를 합칠 때는 `cn()` 유틸리티(`clsx` + `tailwind-merge`)로 통합합니다. 둘 중에서는 `style` 속성을 더 피합니다 - 정적 문자열 클래스는 `cn()`으로 합쳐도 Tailwind가 빌드 타임에 정상 인식하지만, `style`은 그 경로를 완전히 벗어나 테마 토큰도 `cn()`의 충돌 제거도 적용받지 못합니다. `style`은 서드파티 라이브러리가 값 주입을 `style` prop으로만 강제하는 경우에만 예외적으로 씁니다. 임의값 자체를 금지하는 건 아닙니다 - 실무에서 흔히 쓰는 브래킷 표기(`min-h-[65px]`)처럼 값의 의미가 그대로 드러나는 형태를 우선하고, 매직 넘버로 방치하지 않을 정도로만 신경 씁니다.
  - **색상은 CSS 변수 기반 유틸리티만 사용:** `text-red-400`, `bg-gray-200` 같은 Tailwind 내장 팔레트 색상을 직접 쓰지 않고, `globals.css`의 CSS 변수 기반 유틸리티(`text-muted-foreground`, `bg-background` 등)만 사용합니다. 상태 뱃지처럼 기능적 구분이 꼭 필요한 색상 팔레트는 예외입니다. 새 색상이 필요하면 `globals.css`의 `:root`에 CSS 변수로 추가하고 `@theme inline`에 등록한 뒤 유틸리티로 사용합니다.
  - **접근성 최소 기준:** 이미지에는 `alt`, 아이콘 전용 버튼에는 `aria-label`을 붙이는 정도의 기본기만 지킵니다. WCAG 준수 등 엄격한 접근성 감사는 이 프로젝트 스코프에 포함하지 않습니다.
  - **알림(Toast):** 상태 변경, 에러 등 사용자 피드백은 커스텀 컴포넌트를 새로 만들지 않고 `sonner`를 사용합니다.
- **성능 최적화:** Dynamic Loading, Skeleton Screen, 이미지 최적화(`sharp` 기반 WebP 변환, 크기 명시, Lazy Loading)를 적용하고 Web Vitals(LCP, CLS, FID)를 최적화합니다.

## 7. Supabase, 백엔드, 에러 처리 & 운영

- **매직 스트링 / 매직 넘버 하드코딩 금지:**
  - URL 경로, API 상태값, 타임아웃, z-index 등은 하드코딩하지 않고 `@/constants`로 모듈화하여 관리합니다.
- **환경 변수(`process.env`) 직접 참조 금지:**
  - Zod 등으로 검증된 단일 환경변수 파이프라인(`@/env.ts` 등)을 통해서만 타입 안전하게 환경 변수에 접근합니다.
- **서버/클라이언트 경계 엄격화:**
  - 서버 전용 모듈 상단에는 `import 'server-only'`를 필수 명시하고, 클라이언트 컴포넌트로 시크릿 키나 DB 자격 증명이 유출되지 않도록 경계를 명확히 분리합니다.
- **Supabase DB 타입 연동:**
  - DB 타입을 직접 작성하지 않고, `npm run db:types`로 추출된 `Database` 타입(`@/lib/db/database.types.ts`) 기반의 `Tables<'table_name'>` 형태로 자동 연동해 사용합니다.
- **포괄적 에러 처리:**
  - 모든 Async/Fetch 작업 및 API 호출에는 try-catch, 로딩 상태, Fallback UI를 갖춘 `<Suspense>` 및 Error Boundary 처리를 필수 포함합니다.
  - 사용자에게는 기술적 세부사항이 노출되지 않는 유저 친화적 에러 메시지를 제공합니다.
  - **예외:** Server Action에서 폼 검증 실패 등 예상 가능한 에러는 try-catch로 던지지 않고 `useActionState`의 반환값으로 모델링합니다. try-catch와 Error Boundary는 예기치 못한 예외에만 사용합니다.
- **로깅 및 개인정보 마스킹:**
  - 에러/디버그 로그에 이름, 주소, 연락처 등 개인정보(PII)를 원문 그대로 남기지 않고, 마스킹하거나 리소스 ID 같은 식별자로 대체합니다.
- **동시 상태 변경 방지 (경량 처리):**
  - 핵심 엔티티의 상태 변경은 `UPDATE ... WHERE status = '이전상태'` 형태의 조건부 업데이트로 처리하여, 관리자 수동 변경과 외부 웹훅 콜백처럼 서로 다른 경로에서 동시에 들어와도 상태가 꼬이지 않게 합니다. 별도의 분산 락 시스템은 이 프로젝트 규모에서 과설계이므로 도입하지 않습니다.
- **의존성 추가 전 확인:**
  - 새 npm 패키지를 추가하기 전, 이미 설치된 패키지(Zod, date-fns 등)로 대체 가능한지 먼저 확인합니다.

## 8. 외부 노출 API 설계 규칙 (외부 엔드포인트)

> **적용 범위**: 다른 클라이언트 앱이 호출하는 `app/api/**` 외부 공개 엔드포인트에 한합니다. 같은 Next.js 앱 내부 페이지가 쓰는 Server Component 데이터 패칭에는 적용하지 않습니다.

- **응답 스키마 분리 (DB 타입 직접 노출 금지):**
  - 외부 엔드포인트의 응답은 Supabase `Tables<'table_name'>`를 그대로 리턴하지 않고, `@/schemas/api/*.ts`에 정의한 전용 Zod 스키마로 변환 후 반환합니다.
  - 이유: DB 컬럼(원가, 거래처 식별자 등 내부 정보)의 실수 유출을 막고, DB 스키마 변경이 외부 API의 breaking change로 곧바로 이어지지 않도록 계약을 분리하기 위함입니다.
  - 내부 전용 페이지/관리자 대시보드는 기존 규칙(7번 섹션, `Tables<'table_name'>` 직접 사용)을 그대로 따릅니다.
- **인증 경로 분리:**
  - 내부 웹 페이지: Supabase 세션 쿠키 기반 인증을 사용합니다.
  - 외부 클라이언트(다른 앱/웹 서비스): API Key 또는 JWT Bearer 토큰 기반 인증을 별도 미들웨어로 검증합니다. 두 인증 경로를 하나의 핸들러에서 분기 처리하지 않고 명확히 분리합니다.
- **Rate Limiting:** 외부 API Key 인증 미들웨어에는 Upstash Ratelimit을 함께 적용합니다. Supabase 자체 rate limit은 Supabase 인프라(Auth, PostgREST 직접 접근 등) 보호용이라 우리 커스텀 API 라우트에는 적용되지 않으므로 별도로 필요합니다.
- **응답/에러 포맷 통일:** 모든 외부 엔드포인트는 동일한 성공/에러 응답 envelope(예: `{ data, error }` 형태)을 따르고, 에러는 HTTP status와 함께 `@/constants`에 정의된 프로젝트 공통 에러 코드를 포함합니다.

## 9. 파일 업로드 처리 규칙

- **사용자가 업로드하는 문서, 이미지 등 대용량 파일**은 서버를 경유하지 않고, 서버에서 발급한 사전 서명 URL(pre-signed URL)로 클라이언트가 Supabase Storage에 직접 업로드합니다.
- **업로드 전 검증**: 허용 포맷(pdf/png/jpg/webp 등)과 최대 용량은 `@/constants`로 상수화하여, 클라이언트와 서버 양쪽에서 이중 검증합니다.
- **접근 URL**: 민감한 콘텐츠는 영구 public URL을 발급하지 않고, 만료 시간이 있는 서명 URL로만 접근하도록 합니다.

## 10. 다국어/문자열 관리

- **하드코딩 금지:** 사용자에게 노출되는 모든 문자열(UI 텍스트, API 에러 메시지 등)은 코드에 직접 쓰지 않고 `src/locales/ko.ts`, `en.ts` 기반 locale로 관리합니다. 해당 영역의 locale 그룹이 없으면 새로 만듭니다. 무거운 i18n 라이브러리 없이 자체 `useT()` 훅 + locale 객체로 가볍게 구현합니다.
- **클라이언트 컴포넌트:** `useT()` 훅으로 `ko.ts`/`en.ts`의 문구를 가져와 씁니다.
- **서버/API 라우트:** `useT()`는 React 훅이라 서버 코드에서 쓸 수 없습니다. API 응답에는 `@/constants/api-errors.ts`의 `API_ERROR_CODES` 코드만 담고, 실제 번역 문구는 클라이언트의 `getApiErrorMessage()`가 코드를 받아 locale 문구로 변환합니다.
- **예외:** 테스트 코드의 `it`/`describe` 설명 문자열은 다른 개발자만 읽고 사용자에게 노출되지 않으므로 locale 대상이 아니며, 코드 주석과 동일한 기준(가독성 우선)을 따릅니다.

## 11. 작업 진행 관리 (PLAN.md)

- 작업 중 `.claude/.temp/PLAN.md`의 해당 항목 상태를 즉시 업데이트합니다: 완료 `⬜` → `✅`, 진행 중 `⬜` → `🚧`.
- 커밋 열에 실제 커밋 메시지(또는 `-`)를 기입하고, 상단 "현재 진행 상황" 표도 함께 갱신합니다.
- **새 작업을 시작하기 전**, `.claude/.temp/PLAN.md`에 해당 항목이 없으면 먼저 추가한 뒤 구현합니다.
