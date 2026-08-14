# Button 등 UI 프리미티브는 @base-ui/react라 asChild가 아니라 render prop

`src/components/ui/button.tsx`는 Radix가 아니라 `@base-ui/react/button`을 감싼 컴포넌트다. shadcn/Radix 문서나 예제에 익숙하면 링크를 버튼처럼 보이게 할 때 `asChild` + 자식 엘리먼트 패턴을 쓰기 쉬운데, `@base-ui/react`의 `ButtonProps`에는 `asChild`가 없다. `asChild`를 넘기면 그냥 무시되는 게 아니라 알 수 없는 DOM 속성으로 새서 타입 에러가 난다.

Base UI는 대신 `render` prop을 쓴다. `render`에 렌더링할 엘리먼트(또는 렌더 함수)를 넘기면 Base UI가 그 엘리먼트에 자기 props(className, onClick 등)를 병합해서 렌더링한다.

## 올바른 패턴

```tsx
<Button render={<Link href={CONSUMER_ROUTES.NEW_ORDER} />} className="w-fit">
  {t.consumer.mypage.newOrderButton}
</Button>
```

`asChild` + children 패턴(Radix 스타일)은 이 프로젝트에서 쓰지 않는다.

## 확인 방법

`node_modules/@base-ui/react/internals/types.d.ts`의 `BaseUIComponentProps`에 `render` prop이 정의돼 있고 `asChild`는 없다. `node_modules/@base-ui/react/button/Button.d.ts`도 `NativeButtonProps`와 `BaseUIComponentProps`만 확장한다.
