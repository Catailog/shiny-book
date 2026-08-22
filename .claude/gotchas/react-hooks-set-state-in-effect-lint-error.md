# eslint-plugin-react-hooks가 useEffect 안의 setState 직접 호출을 에러로 잡음

"prop이 바뀌면 상태를 초기화한다" 같은 흔한 패턴을 `useEffect(() => { if (조건) setState(...) }, [deps])` 형태로 쓰면 `react-hooks/set-state-in-effect` 규칙이 에러를 낸다: "Calling setState synchronously within an effect can trigger cascading renders". `npm run lint`에서만 잡히고 `type-check`는 통과하므로, 타입체크만 보고 넘어가면 놓치기 쉽다.

## 해결

React 공식 문서가 권장하는 "렌더링 중 상태 조정" 패턴으로 바꾼다. `useEffect`로 감싸지 않고, 컴포넌트 함수 본문에서 조건을 직접 체크해서 그 자리에서 `setState`를 호출한다.

```tsx
// 잘못된 패턴 (lint 에러)
useEffect(() => {
  if (condition) setValue(newValue);
}, [condition, newValue]);

// 올바른 패턴
if (condition) {
  setValue(newValue);
}
```

렌더링 중 호출하는 `setState`는 그 렌더를 즉시 중단하고 새 값으로 다시 렌더링하므로 화면에 중간 상태가 깜빡이지 않고, `useEffect`처럼 한 프레임 늦게 반영되지도 않는다. 다만 반드시 조건이 매번 참이 되지 않도록 가드(예: 이미 설정된 값과 같으면 스킵)를 걸어야 무한 렌더 루프를 피할 수 있다.

`src/components/ui/typing-animation.tsx`(텍스트가 바뀌면 타이핑 상태 초기화)와 `src/components/ui/border-beam-once.tsx`(재생 시작 시점의 좌표 고정, 이후 롤백됨)에서 이 문제를 겪었다.
