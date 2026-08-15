# Next.js 16: middleware.ts가 proxy.ts로 이름 변경됨

`middleware.ts`/`export function middleware()` 컨벤션은 Next.js 16부터 deprecated고, `proxy.ts`/`export function proxy()`로 바뀌었다. 파일 위치는 기존과 동일하게 `src/` 아래(app과 같은 레벨)에 둔다. 동작 자체(matcher, NextRequest/NextResponse API)는 그대로고 파일명과 export 이름만 바뀐 것.

이 프로젝트에서는 `src/proxy.ts`에 Supabase 세션 갱신 + `/admin` 라우트 보호 로직이 들어있다. `middleware.ts`로 된 예제나 옛 문서를 참고할 때 그대로 베끼면 파일 자체가 무시돼서 동작하지 않으니 주의.

## 확인 방법

`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md` 참고. `middleware.md`는 남아있지만 "deprecated, renamed to proxy.js"라고만 안내하고 실제 문서는 proxy.md로 리다이렉트됨.
