# Chrome이 View Transition의 px 단위 clip-path를 분수 배율 디스플레이에서 잘못 그림

`document.documentElement.animate({ clipPath: [...] }, { pseudoElement: '::view-transition-new(root)' })` 방식으로 원형 확산 애니메이션을 만들 때, `circle(0px at Xpx Ypx)`처럼 절대 px 좌표를 쓰면 Windows의 분수 배율 디스플레이(125%, 150% 등)에서 페이지 로드 후 첫 전환 애니메이션이 좌표를 배율 보정 없이 그대로 적용한다(Chrome 버그, Magic UI 소스 주석에 `#989`로 언급됨). `getBoundingClientRect()`로 계산한 좌표 자체는 정확한데도, 화면에는 배율만큼 어긋난 엉뚱한 위치에서 애니메이션이 시작/종료된다.

증상이 "클릭한 버튼 근처가 아니라 전혀 다른 위치에서 원이 나타난다"처럼 보여서, 좌표 계산 로직이 잘못됐다고 착각하기 쉽다. 실제로는 좌표 계산은 맞고, 브라우저가 그 값을 그리는 단계에서 어긋난다. 여러 번 클릭해보면 배율이 100%가 아닌 모니터에서만 재현되고, 개발자가 100% 배율 환경에서 테스트하면 재현이 안 된다.

## 해결

절대 px 대신 뷰포트 대비 퍼센트 좌표로 clip-path를 계산한다. `circle(0% at ${(x/viewportWidth)*100}% ${(y/viewportHeight)*100}%)` 형태로 바꾸고, 반지름도 `hypot(viewportWidth, viewportHeight) / Math.SQRT2`를 100%로 놓고 비율로 환산한다. 퍼센트는 렌더링 시점에 실제 박스 크기를 기준으로 다시 계산되므로 배율 보정 버그를 우회한다.

`src/components/theme-toggle.tsx`의 다크모드 토글 원형 확산 애니메이션에서 이 문제를 겪었다.
