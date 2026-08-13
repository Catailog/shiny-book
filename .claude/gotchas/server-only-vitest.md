# server-only 패키지가 Vitest에서 무조건 throw함

`server-only` 패키지의 `index.js`는 조건 없이 `throw new Error(...)`한다. Next.js 빌드에서는 `exports` 필드의 `react-server` 조건에 걸려 `empty.js`(no-op)로 치환되지만, Vitest는 이 조건을 모르기 때문에 `import 'server-only'`가 있는 모듈을 테스트에서 import하면 즉시 예외가 발생한다.

## 해결

`vitest.config.mts`의 `resolve.alias`에 `server-only`를 `node_modules/server-only/empty.js`로 매핑한다.

```ts
resolve: {
  alias: {
    'server-only': path.resolve(import.meta.dirname, './node_modules/server-only/empty.js'),
  },
},
```

Next.js 프로덕션 빌드는 이 alias의 영향을 받지 않으므로 클라이언트 번들 유출 방지 기능은 그대로 유지된다.
