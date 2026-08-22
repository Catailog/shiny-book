# 단어 단위로 쪼개서 애니메이션하는 텍스트에서 줄바꿈 지점에 공백이 그대로 남음

TextAnimate/TypingAnimation류의 "단어마다 애니메이션"을 구현할 때 흔히 `text.split(/(\s+)/)`로 단어와 공백을 각각의 `motion.span`으로 쪼갠 뒤 `inline-block` + `white-space: pre`를 준다(각 span의 stagger 애니메이션을 위해 `inline-block`이 필요). 이때 줄바꿈이 하필 그 공백 span 위치에서 일어나면, 브라우저가 평범한 텍스트에서 하듯 그 공백을 자동으로 접어버리지(collapse) 않는다. `white-space: pre`가 공백을 항상 그대로 렌더링하도록 강제하기 때문이다.

그 결과 가운데 정렬(`text-center`)된 텍스트는 그 보이지 않는 공백만큼 줄 너비 계산이 커져서 실제 글자가 중앙에서 옆으로 밀려 보이고, 왼쪽 정렬 텍스트는 줄바꿈된 다음 줄이 공백으로 시작하는 것처럼 보인다.

## 해결

공백만 담은 segment는 `inline-block whitespace-pre`가 아니라 `inline whitespace-normal`로 렌더링한다. 이러면 그 부분만 브라우저의 기본 공백 접기 동작을 따르게 되어 줄바꿈 지점에서 자연스럽게 사라진다. 단어(실제 텍스트) segment는 그대로 `inline-block whitespace-pre`를 유지해야 stagger 애니메이션이 깨지지 않는다. 공백을 단어 뒤에 붙여서 하나의 segment로 합치는 방식은 왼쪽 정렬에서는 괜찮아 보여도 가운데 정렬에서 새로운 어긋남을 만들어내므로 피한다.

`src/components/ui/text-animate.tsx`(Magic UI TextAnimate 커스터마이징)에서 이 문제를 겪었다.
