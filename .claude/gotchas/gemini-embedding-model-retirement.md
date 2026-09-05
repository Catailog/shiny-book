# Google이 임베딩 모델을 조용히 은퇴시킨다 - 실패 폴백이 있으면 안 보임

`text-embedding-004`는 2026-01-14에 Google이 완전히 셧다운했다(Google AI Developers Forum, `firebase/genkit#4551`, `simonw/llm-gemini#102` 등에서 확인). 그런데 이 프로젝트는 8개월 가까이 이 사실을 몰랐다. 이유는 `retrieve-context.ts`가 임베딩 호출 실패를 catch해서 지식베이스 전체를 프롬프트에 넣는 폴백으로 조용히 넘어가도록 설계돼 있어서, 챗봇 자체는 계속 정상 응답한 것처럼 보였기 때문이다. 실패가 드러난 건 폴백이 없는 관리자 "재색인" 버튼을 직접 눌렀을 때뿐이었다.

## 교훈

- 폴백이 있는 경로는 반드시 별도의 능동적 헬스체크(카나리)가 있어야 한다. 폴백 자체가 문제를 숨긴다.
- Google 임베딩 모델은 주기적으로 은퇴한다: `embedding-001`(2025-08-14) -> `text-embedding-004`(2026-01-14) -> `gemini-embedding-001`(현재). 다음 세대 교체도 언젠가 온다.

## `gemini-embedding-001`로 옮길 때 주의할 점

`text-embedding-004`는 기본 출력이 768차원이었지만, `gemini-embedding-001`은 **기본 출력이 3072차원**이다. `knowledge_chunks.embedding`은 `vector(768)`로 고정된 컬럼이라, `outputDimensionality`를 명시적으로 안 주면 차원 불일치로 DB insert가 깨진다.

```ts
await embed({
  model,
  value,
  providerOptions: {
    google: { outputDimensionality: AI_EMBEDDING_DIMENSIONS, taskType: 'RETRIEVAL_QUERY' },
  },
});
```

`@ai-sdk/google`의 `GoogleEmbeddingModel`은 `providerOptions.google.outputDimensionality`와 `taskType`을 그대로 API 요청 바디에 전달한다(`node_modules/@ai-sdk/google/dist/index.js`의 `GoogleEmbeddingModel.doEmbed` 참고). `taskType`은 필수는 아니지만, 문서를 저장할 때는 `RETRIEVAL_DOCUMENT`, 검색 질의를 임베딩할 때는 `RETRIEVAL_QUERY`로 구분해 주는 걸 Google이 권장한다.

`match_knowledge_chunks` SQL 함수는 pgvector의 코사인 거리 연산자(`<=>`)를 쓰는데, 이건 벡터 크기로 나눠서 계산하므로 임베딩이 단위 벡터로 정규화돼 있는지는 결과에 영향을 주지 않는다. `outputDimensionality`로 자른 임베딩을 별도로 재정규화할 필요는 없다.
