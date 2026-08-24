# Supabase CLI `storage cp`로 로컬 -> 원격 업로드가 안 됨 (2.114.0 기준)

공식 문서(`supabase storage cp --help`)의 EXAMPLES 섹션은 `supabase storage cp readme.md ss:///bucket/readme.md`로 로컬 파일을 스토리지에 업로드할 수 있다고 안내하지만, 실제로 실행하면 `--experimental` 플래그를 요구하고, 그 플래그를 붙여도 다음 에러로 실패한다.

```
{"_tag":"Error","error":{"code":"LegacyStorageUnsupportedOperationError","message":"Unsupported operation","suggestion":"Run cp -r <src> <dst> to copy between local directories."}}
```

`-r`(디렉터리 재귀 복사)을 붙여도 동일하게 실패한다. `supabase storage ls`(원격 버킷 목록 조회)는 정상 동작해서 연결 자체는 문제없다 - `cp`의 로컬 -> 원격 업로드 방향만 아직 제대로 구현이 안 된 것으로 보인다.

## 해결

로컬 파일을 스토리지에 대량 업로드해야 하면 CLI 대신 `@supabase/supabase-js`의 `storage.from(bucket).upload(path, buffer, { upsert: true })`를 쓰는 별도 Node 스크립트로 처리한다. `upsert: true`로 하면 스크립트를 재실행해도 같은 경로를 덮어써서 객체가 중복 누적되지 않는다.

`scripts/seed-test-photo-pool.mjs`가 이 패턴으로 로컬 이미지 960장을 스토리지에 업로드한다.
