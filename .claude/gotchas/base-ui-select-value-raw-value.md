# Base UI Select.Value는 기본적으로 선택된 항목의 라벨이 아니라 원본 value를 보여줌

`npx shadcn add select`로 설치한 `src/components/ui/select.tsx`는 `@base-ui/react/select`를 감싼다. Radix `Select.Value`는 선택된 `Select.Item`의 자식(children)을 자동으로 보여주지만, Base UI의 `Select.Value`는 그렇지 않다 - `children`을 안 주면 `value` prop에 들어있는 원본 값(예: `'percentage'`)을 그대로 문자열로 렌더링한다. `SelectItem`에 한글 라벨을 넣어놔도 트리거에는 `percentage` 같은 raw 값이 그대로 노출된다.

## 해결

`Select.Value`(`SelectValue`)에 `value => ReactNode` 형태의 함수를 `children`으로 넘겨서 값을 라벨로 직접 매핑한다.

```tsx
<SelectValue>
  {(value: string) =>
    value === DISCOUNT_TYPE.PERCENTAGE
      ? t.admin.coupons.discountTypeOptions.percentage
      : t.admin.coupons.discountTypeOptions.fixed
  }
</SelectValue>
```

`src/app/admin/(protected)/coupons/coupon-form.tsx`의 할인 유형 select에서 이 문제를 겪었다. `<SelectValue />`만 써두면 브라우저에서 셀렉트 박스에 `percentage`/`fixed`가 그대로 보인다 - 콘솔 에러 없이 조용히 잘못된 화면만 나오므로 직접 렌더링해서 눈으로 확인해야 발견된다.

## 확인 방법

`node_modules/@base-ui/react/select/value/SelectValue.d.ts`의 `SelectValueProps.children` 타입 주석에 이 사용법이 예시로 나와 있다.
