# `z.coerce.boolean()`으로 환경변수 boolean 플래그를 만들면 안 됨

환경변수는 항상 문자열이라 `ALLOW_TEST_PAYMENT=false`처럼 값을 넣어도 `process.env.ALLOW_TEST_PAYMENT`는 문자열 `'false'`다. `z.coerce.boolean()`은 내부적으로 JS의 `Boolean(value)`를 쓰는데, `Boolean('false')`는 빈 문자열이 아니라서 `true`다. 즉 `z.coerce.boolean()`을 쓰면 값을 `'false'`로 명시적으로 꺼도 스키마 통과 후에는 `true`가 되는, 플래그의 목적 자체를 무력화하는 결과가 나온다.

## 해결

문자열을 직접 비교해서 변환한다.

```ts
ALLOW_TEST_PAYMENT: z
  .string()
  .default('true')
  .transform((value) => value === 'true'),
```

`src/env.ts`의 `ALLOW_TEST_PAYMENT`/`ALLOW_TEST_LOGIN`이 이 패턴을 쓴다.
