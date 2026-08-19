---
title: 결제위젯 클라이언트 에러 가이드
description: 결제위젯 클라이언트 연동에서 만날 수 있는 에러와 대응 방법을 알려드릴게요.
keyword: 에러, 결제위젯, 렌더 에러, 승인 에러
publishedAt: 2024-04-30
thumbnailSrc: https://static.tosspayments.com/docs/blog/error-handling.png
---

---

# 결제위젯 클라이언트 에러 가이드

2024년 5월 2일 ・ 읽는 시간 5분

![에러 핸들링 커버 이미지](https://static.tosspayments.com/docs/blog/error-handling.png#2314x1028)

개발을 하다보면 문서에 나오는 기본 시나리오대로, [해피 패스](https://en.wikipedia.org/wiki/Happy_path)로 한 번에 연동하기란 정말 어렵죠. 대부분의 개발자는 디버깅에 고생하면서 연동을 마무리하게 돼요. 이번 가이드는 그런 고생을 덜기 위해 [결제 연동하기 가이드](/guides/payment-widget/integration)를 기반으로 클라이언트 연동 단계에서 만날 수 있는 에러와 대응 방법을 알려드릴게요.

## 90%의 에러는 이럴 때 나요

먼저, 이 가이드를 보기 전에 다음 세 가지를 확인해 주세요.

✅ **API 키를 [결제 연동 키](/reference/using-api/api-keys#주문서형-결제창형-연동-키)로 사용해야 해요.** 결제 연동 키는 토스페이먼츠 전자결제 신청 이후에만 확인할 수 있어요. 신청 전에는 [문서에 있는 테스트 키](/guides/payment-widget/integration)만 사용할 수 있어요.

✅ **사용하는 API 키의 [클라이언트 키-시크릿 키 쌍](/reference/using-api/api-keys#클라이언트-키와-시크릿-키)이 맞아야 해요.**

✅ **결제 UI가 렌더된 후에 결제를 요청해야 돼요.**

혹시 해결됐나요? 그럼 나머지 가이드는 보지 않아도 괜찮아요. 아직 문제가 해결되지 않았다면 같이 살펴봐요!

## 1️⃣ SDK 초기화가 안 돼요

결제위젯을 사용하기 위해 [SDK를 초기화](/sdk/widget-js#결제위젯-초기화-파라미터) 하려면 클라이언트 키, `customerKey`를 올바르게 넣어야 해요.

### API 키가 잘못된 값일 때

![API 키 콘솔 에러](https://static.tosspayments.com/docs/blog/error-1.png#2016x650)

올바른 클라이언트 키를 넣었는지 확인해야 해요. 임의의 값을 넣으면 안 돼요. 초기화를 위해서는 ‘내 프로젝트’임을 알려줄 수 있는 정보가 필요해요. 그래서 가입한 내 계정에 발급된 클라이언트 키를 사용해야 해요. **개발자센터에서 [결제 연동 키 > 클라이언트 키](https://developers.tosspayments.com/my/api-keys)가 맞는지 확인하세요.** 결제위젯을 연동해야 하기 때문에 ‘결제 연동 키’를 사용해야 해요. 'API 개별 연동 키'는 사용하지 마세요.

### customerKey가 잘못된 값일 때

![customerKey 콘솔 에러](https://static.tosspayments.com/docs/blog/error-2.png#2016x650)

[`customerKey`](/sdk/widget-js#초기화-파라미터-customerKey) 형식이 잘못됐어요. 초기화를 위해서는 구매자를 식별하는 데 사용되는 [`customerKey`](/sdk/widget-js#초기화-파라미터-customerKey)를 넣어줘야 해요. 이 값은 각 구매자에게 고유한 식별 번호를 부여해요. 구매자를 식별하는 값이니 안전하게 관리해야겠죠. 따라서 **[`customerKey`](/sdk/widget-js#초기화-파라미터-customerKey)는 영문 대소문자, 숫자, 특수문자 -, \*, =, ., @로 2자 이상 50자 이하로, 혹은 [UUID](/resources/glossary/uuid) 형식으로 만들어 주세요.**

초기화 코드는 다음과 같이 작성해 주세요.

```js title="예시"
const widgetClientKey = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm';
const customerKey = 'JuNm6zJ0Afr7xUwStZAwn';
const paymentWidget = PaymentWidget(widgetClientKey, customerKey);
```

## 2️⃣ 결제 UI가 안 보여요

[결제 UI를 렌더하는 메서드](/sdk/widget-js#renderpaymentmethods선택자-결제-금액-옵션)를 실행하려면 아까 만든 결제 영역의 CSS 선택자와 결제 금액을 메서드의 파라미터로 넣어야 해요.

### CSS 선택자가 누락됐거나 잘못됐을 때

![CSS 누락 콘솔 에러](https://static.tosspayments.com/docs/blog/error-3.png#2016x650)

만들었던 결제 영역의 CSS 선택자를 첫 번째 파라미터로 넣어야 실행돼요.

### 여러 결제 UI 중 어떤 UI인지 특정하지 않았을 때

![varientKey 콘솔 에러](https://static.tosspayments.com/docs/blog/error-5.png#2016x652)

선택 파라미터인 [`variantKey`](/sdk/widget-js#renderpaymentmethods선택자-결제-금액-옵션-optionsvariantkey)는 결제 UI를 여러 개 만들 때 각각을 구분하는 역할을 해요. **만약 어드민에서 결제 UI를 여러 개 만들었다면 이 값이 비어있으면 안 돼요.** `DEFAULT`라는 [`variantKey`](/sdk/widget-js#renderpaymentmethods선택자-결제-금액-옵션-optionsvariantkey)를 사용해서 기본 결제 UI를 렌더링 하거나, 설정한 결제 UI의 [`variantKey`](/sdk/widget-js#renderpaymentmethods선택자-결제-금액-옵션-optionsvariantkey)를 넣어주세요.

### 애플 페이가 보이지 않을 때

개발에 사용하고 있는 브라우저를 확인해요. 애플페이는 iPhone 및 Mac Safari 에서만 노출돼요. 어드민 페이지에서 예상 이미지를 확인할 수 있어요.

### 여전히 결제 UI가 렌더링되지 않을 때

- `UNAUTHORIZED_KEY` 에러가 난다면 클라이언트 키를 다시 확인하세요.
- `NOT_REGISTERED_PAYMENT_WIDGET` 에러가 난다면 어드민에서 결제 UI를 추가하세요. 결제 UI가 생성되지 않았을 때 발생하는 에러입니다.
- [IE 환경](/guides/environment#지원-플랫폼브라우저-환경)은 지원하지 않습니다.

## 3️⃣ 결제 요청에 실패했어요

### 결제하기 버튼을 눌렀는데, 구매자가 선택한 결제수단의 결제창이 열리지 않을 때

![결제 UI 렌더 전 결제 요청 콘솔 에러](https://static.tosspayments.com/docs/blog/error-6.png#2016x650)

결제 UI가 렌더링되기 전에 결제를 요청했기 때문이에요. **반드시 결제 UI가 렌더링된 이후에 결제 요청 메서드를 호출하세요.** 만약 UI가 렌더링됐는지 확인한 뒤 메서드를 실행하려면 [`ready` 이벤트](/sdk/widget-js#on이벤트-콜백-eventname)를 추가하세요.

```js
paymentMethodWidget.on('ready', function () {
  button.disabled = false;
  coupon.disabled = false;
});
```

### 계속 로딩 중인 화면에서 변화가 없을 때

아직 결제 요청 중이에요. **`successUrl`, `failUrl` 페이지에서 요청 결과를 확인한 뒤, 결제 승인 API까지 호출해야 결제가 완료돼요.** 결제 승인 API를 호출하는 코드가 있는지 확인하세요.

만약 iframe을 사용하고 있다면 요청 결과 페이지(`successUrl`, `failUrl`)로 이동할 수 없어요.

### 기타

- 앱으로 개발했는데, 카드사 앱으로 이동하지 않는다면 카드사 [앱스킴](/resources/glossary/deep-link)을 등록해야 돼요. 자세한 내용은 [웹뷰 가이드](/guides/webview)에서 확인하세요.

- iframe을 이용한 결제창 팝업 형태는 PC에서만 제공해요.

## 4️⃣ 결제요청은 됐는데 failUrl로 이동해요

[`failUrl`](/sdk/v2/error-codes#failurl로-전달되는-에러)의 쿼리 파라미터에 있는 에러 코드와 메시지를 확인해 보세요.

- `PAY_PROCESS_CANCELED`

  - 구매자에 의해 결제가 취소된 거에요. 결제 과정이 중단된 것이라서 `failUrl`로 `orderId`가 전달되지 않아요. 구매 고객에게 안내해 주세요.

- `PAY_PROCESS_ABORTED`

  - 상점 계약 또는 원천사 문제가 있을 때 발생해요. 토스페이먼츠와 계약, 카드사 심사 등 모든 계약 과정이 완료됐는지 확인하세요. 계약 상태는 1544-7772로 문의해주세요. 계약이 모두 완료됐어도 테스트 키와 라이브 키가 동기화 안 되어있을 수도 있습니다. 라이브 키로 테스트하거나 [디스코드](https://discord.com/invite/A4fRFXQhRu)에서 실시간 문의를 남겨주세요.
  - 테스트 환경에서 간편결제는 토스페이, 네이버페이, 카카오페이만 지원해요. 토스페이, 네이버페이만 모든 테스트 키로 연동할 수 있습니다. 카카오페이는 계약 후 발급받는 내 테스트 키로 연동할 수 있습니다. 페이코 등 기타 간편결제는 라이브 키로 테스트하세요.
  - 인증실패 등 원천사 에러 메시지를 받았다면, PG와 관련없는 에러입니다. 원천사에 문의해주세요.

- `REJECT_CARD_COMPANY`
  - 구매자가 입력한 카드 정보에 문제가 있을 때 발생해요. 원인은 비밀번호 오류, 한도 초과, 포인트 부족 등 다양합니다. 오류 메시지를 확인하고 구매 고객에게 안내해 주세요.

## 정리

✅ 결제위젯 초기화가 실패할 때는 클라이언트 키, [`customerKey`](/sdk/widget-js#초기화-파라미터-customerKey)를 확인해 보세요.

✅ 결제 UI 렌더가 실패할 때는 [`renderPaymentMethods()`](/sdk/widget-js#renderpaymentmethods선택자-결제-금액-옵션)의 파라미터를 확인해 보세요.

✅ 결제 요청에 실패했다면 결제 UI가 렌더된 상태인지 확인해 보세요.

아직도 에러가 해결되지 않았나요? 그렇다면 [디스코드](https://discord.com/invite/A4fRFXQhRu)에서 실시간 문의를 남겨주세요.

서버 에러는 [에러 코드](/reference/error-codes)와 [API 로그](https://developers.tosspayments.com/my/api-logs)에서 이유와 해결 방법을 알 수 있어요.

---

📍 **함께 읽어보기**

- [SDK 에러 코드 확인하기](/sdk/error-codes)
