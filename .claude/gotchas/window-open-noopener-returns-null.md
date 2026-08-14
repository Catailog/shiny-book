# window.open에 noopener를 주면 반환값이 null이라 나중에 조작 불가

비동기로 서명 URL을 받아온 뒤 새 탭에 열어야 할 때(팝업 차단을 피하려고 클릭 핸들러 안에서 먼저 `window.open('', '_blank')`로 빈 탭을 열어두고, await 이후에 `newTab.location.href = url`로 이동시키는 패턴), 세 번째 인자로 `'noopener,noreferrer'`를 주면 Chrome에서 `window.open`이 `null`을 반환한다. `noopener`는 새 창이 opener를 참조하지 못하게 막는 옵션인데, 그 부작용으로 호출한 쪽도 새 창에 대한 참조 자체를 얻지 못한다.

결과적으로 `newTab?.location.href = url` 같은 옵셔널 체이닝 코드는 조용히 아무 일도 하지 않고, 새로 열린 탭은 `about:blank`로 남는다. 에러가 던져지지 않아서 콘솔에도 아무것도 안 찍히고 디버깅이 까다롭다.

## 해결

새 탭 참조를 나중에 조작해야 하는 경우 `noopener`/`noreferrer`를 빼고 `window.open('', '_blank')`만 쓴다. 여는 URL이 우리 서버가 발급한 신뢰 가능한 서명 URL이라면 opener 노출 위험은 낮다.

`src/app/admin/(protected)/view-order-file-button.tsx`에서 관리자가 주문의 원고/표지 파일을 새 탭에서 보는 버튼을 만들 때 이 문제를 겪었다.
