# 구현 계획: 본문 해시태그 SEO 활용 — ReformedTV 숏츠 · 최더함의 철학시가

- spec: ./spec.md
- 상태: 진행 중

## 개요

본문 `#태그`를 공용 유틸(`src/lib/hashtags.ts`)로 뽑아 Article·VideoObject JSON-LD `keywords`에 넣고,
ReformedTV **숏츠**의 description을 `{제목} — {정리된 본문}`으로 바꿔 글마다 고유하게 만든다.
철학시가는 이미 적용된 description·Article keywords를 유지하고 VideoObject `keywords`·카카오 공유 description만 보강한다.
화면 본문·DB·폼·일반 영상 출력은 바꾸지 않는다.

## 설계 결정

- **정규식은 공용 모듈 안에 숨기고 함수만 export** — `HASHTAG`는 `/g` 플래그라 여러 곳에서 `.test()`로 쓰면 `lastIndex`가 꼬인다.
  `extractHashtags(content): string[]`(`#` 제거·중복 제거, 기존 `philosophiaKeywords`와 동일)와
  `stripHashtags(text): string`(태그를 공백으로 치환)만 노출한다. 정규식은 기존 `/#[^\s#]+/g` 그대로 — 철학시가 동작 불변
- **`philosophiaKeywords`는 지우고 호출부를 `extractHashtags`로 교체** — 같은 일을 하는 래퍼를 남기지 않는다. 테스트 3건은 `src/lib/hashtags.test.ts`로 옮긴다
- **`shortsDescription(content, title)`은 줄 단위 처리** — 줄마다: URL(`https?://`) 포함 줄 제거 → 공통 문구 줄(`마스터스 Reformed TV`, `Soli Deo Gloria`, `Semper Reformanda`) 제거 → 태그 제거 → 공백 정리 후 합친다.
  결과가 비면 `{제목} — 마스터스개혁파총회 ReformedTV 숏츠`. 있으면 `truncateAtSentence(`${title} — ${body}`, 120)` (`src/lib/text.ts` 재사용)
- **위치는 `src/features/reformed-tv/content-meta.ts`** — 철학시가 `content-meta.ts`와 같은 이름·역할로 맞춘다
- **ReformedTV 상세는 숏츠일 때만 분기** — `const isShorts = post.category === '숏츠'`.
  일반 영상의 기존 계산식(meta: HTML 제거+공백 정리 120자 / Article: `content?.slice(0,120)` / VideoObject: 정리 120자)은 **한 글자도 안 바꾼다**(외과적 변경, spec 비목표).
  `generateMetadata` select에 `category` 추가
- **카카오 공유 description** — 숏츠·철학시가는 계산한 `description`을 넘긴다. 일반 영상은 기존대로 `post.content`
- **`youtubeVideoObjectJsonLd`에 `keywords?: string[]`** — `articleJsonLd`와 같은 `...(keywords?.length ? { keywords } : {})`. 호출부가 두 곳뿐이고 선택 파라미터라 호환
- **커밋은 사용자가 직접** — `.claude/feature-workflow.md` BUILD 규칙. 작업이 검증까지 끝나면 파일 목록 + 메시지 초안만 제시
- **lint는 변경 파일 기준** — 전체 `npm run lint`는 기존 파일 오류로 실패하는 상태(2026-11-02 plan.md 기록). 변경 파일만 `npx eslint <files>`로 보고, 전체 결과는 참고로 함께 적는다

## 작업 목록

### 1단계: 기반
- [x] 작업 1: 공용 해시태그 유틸 + 철학시가 이관
- [x] 작업 2: `youtubeVideoObjectJsonLd`에 `keywords` 추가
- [x] 작업 3: `shortsDescription` 유틸

### 체크포인트: 기반
- [x] `npx vitest run` 통과 (기존 테스트 포함) — 35건. **대문자 `C:` 경로에서 실행해야 한다**(소문자 `c:`에서는 vitest가 모듈을 두 벌 로드해 전 파일 `reading 'config'` 오류)
- [x] `npx tsc --noEmit` 통과

### 2단계: 페이지 적용
- [ ] 작업 4: ReformedTV 상세 — 숏츠 description·keywords·공유 문구
- [ ] 작업 5: 철학시가 상세 — VideoObject keywords·공유 문구

### 체크포인트: 페이지 적용
- [ ] `npx vitest run` · 변경 파일 `npx eslint` · `npx tsc --noEmit` · `npm run build` 통과
- [ ] 실제 앱에서 spec 사용자 시나리오 1~6 확인 (숏츠 / 같은 본문 숏츠 2건 / 일반 영상 / 철학시가 / 다른 board id → not-found)
- [ ] 사용자 확인 후 다음으로 진행

### 3단계: 문서
- [ ] 작업 6: 문서 갱신

### 체크포인트: 완료
- [ ] spec 성공 기준 모두 충족
- [ ] REVIEW 준비됨

## 작업 상세

#### 작업 1: 공용 해시태그 유틸 + 철학시가 이관

**설명:** `src/lib/hashtags.ts`를 새로 만들고(첫 줄 한국어 주석) `extractHashtags`·`stripHashtags`를 export한다.
`src/features/philosophia/content-meta.ts`에서 `HASHTAG`·`philosophiaKeywords`를 지우고 `clean()`이 `stripHashtags`를 쓰게 한다.
철학시가 상세의 `philosophiaKeywords(post.content)` 호출을 `extractHashtags(post.content)`로 교체한다.
`philosophiaKeywords` 테스트 3건을 `src/lib/hashtags.test.ts`로 옮기고 `stripHashtags` 테스트를 1~2건 추가한다.

**완료 기준:**
- [x] `philosophiaKeywords`·`HASHTAG` 참조가 저장소에 0건
- [x] 기존 `philosophiaDescription` 테스트 7건이 수정 없이 통과
- [x] `hashtags.test.ts` 통과

**검증:**
- [ ] `npx vitest run`
- [ ] `npx tsc --noEmit`

**의존:** 없음

**예상 파일:**
- `src/lib/hashtags.ts` (신규)
- `src/lib/hashtags.test.ts` (신규)
- `src/features/philosophia/content-meta.ts`
- `src/features/philosophia/content-meta.test.ts`
- `src/app/community/philosophia/[id]/page.tsx` (import·호출 1줄씩)

**규모:** S

#### 작업 2: `youtubeVideoObjectJsonLd`에 `keywords` 추가

**설명:** `src/lib/json-ld.ts`의 `youtubeVideoObjectJsonLd` 입력에 `keywords?: string[]`를 추가하고, 비어 있으면 필드를 넣지 않는다.
`src/lib/json-ld.test.ts`에 있을 때·없을 때(빈 배열 포함) 테스트를 추가한다.

**완료 기준:**
- [x] keywords가 있으면 출력에 포함, 없거나 빈 배열이면 `keywords` 키 자체가 없음
- [x] 기존 json-ld 테스트 통과

**검증:**
- [ ] `npx vitest run`

**의존:** 없음

**예상 파일:**
- `src/lib/json-ld.ts`
- `src/lib/json-ld.test.ts`

**규모:** XS

#### 작업 3: `shortsDescription` 유틸

**설명:** `src/features/reformed-tv/content-meta.ts`(신규, 첫 줄 한국어 주석)에 설계 결정의 규칙대로 `shortsDescription(content, title)`을 만든다.
`content-meta.test.ts`(신규)에 실측 본문 2종(100문100답 강의형 / 연합예배형)으로 테스트한다.

**완료 기준:**
- [x] 결과가 `{제목} — `로 시작하고 `#`·`http`·`Soli Deo Gloria`를 포함하지 않음
- [x] 본문이 같고 제목이 다른 두 입력의 결과가 다름 / 본문이 null·공통 문구뿐이면 폴백
- [x] 120자(+말줄임표 1자) 이하

**검증:**
- [ ] `npx vitest run`

**의존:** 작업 1 (`stripHashtags`)

**예상 파일:**
- `src/features/reformed-tv/content-meta.ts` (신규)
- `src/features/reformed-tv/content-meta.test.ts` (신규)

**규모:** S

#### 작업 4: ReformedTV 상세 — 숏츠 description·keywords·공유 문구

**설명:** `src/app/community/reformed-tv/[id]/page.tsx`
- `generateMetadata`: select에 `category` 추가, 숏츠면 `shortsDescription`, 아니면 기존 식
- 본문: `isShorts`일 때 `description = shortsDescription(...)`, `keywords = extractHashtags(post.content)`를 한 번 계산해
  Article·VideoObject·`ShareButtons`에 넘긴다. 일반 영상은 기존 식과 `keywords` 미전달 유지

**완료 기준:**
- [ ] 숏츠 상세: meta·og description이 `{제목} — …`, Article·VideoObject에 `keywords`
- [ ] 일반 영상 상세: meta description·JSON-LD가 변경 전과 동일(`keywords` 없음)
- [ ] 화면 본문 렌더 불변

**검증:**
- [ ] `npx tsc --noEmit` · `npm run build`
- [ ] 수동 확인: 개발 서버에서 숏츠 1건·같은 본문 숏츠 2건·일반 영상 1건의 HTML(`curl`)에서 `<meta name="description">`과 `application/ld+json` 비교.
      일반 영상은 변경 전 출력(작업 시작 전에 저장)과 diff

**의존:** 작업 1, 2, 3

**예상 파일:**
- `src/app/community/reformed-tv/[id]/page.tsx`

**규모:** S

#### 작업 5: 철학시가 상세 — VideoObject keywords·공유 문구

**설명:** `src/app/community/philosophia/[id]/page.tsx`에서 `extractHashtags(post.content)`를 한 번 계산해
Article·VideoObject 양쪽에 넘기고, `ShareButtons`의 `description`을 `post.content` 대신 이미 계산된 `description`으로 바꾼다.

**완료 기준:**
- [ ] VideoObject에 `keywords` 출력, Article `keywords`와 같은 값
- [ ] meta description은 변경 전과 동일

**검증:**
- [ ] `npm run build`
- [ ] 수동 확인: 철학시가 상세 1건 HTML에서 VideoObject `keywords`, meta description 변경 전후 동일

**의존:** 작업 1, 2

**예상 파일:**
- `src/app/community/philosophia/[id]/page.tsx`

**규모:** XS

#### 작업 6: 문서 갱신

**설명:** `docs/features/philosophia.md`에 공용 모듈 이관·VideoObject keywords·공유 문구 변경을 추가하고,
`docs/todo.md`에 이번 항목(태그 목록 페이지는 보류 항목으로)을 기록한다.
`CLAUDE.md` SEO 가이드의 JSON-LD(VideoObject) 설명에 keywords를 한 줄 반영한다. `context-notes.md`는 SHIP에서 기록한다.

**완료 기준:**
- [ ] 세 문서에 이번 변경과 보류 항목이 반영됨

**검증:**
- [ ] 수동 확인: 문서의 함수명·경로가 실제 코드와 일치 (`grep`)

**의존:** 작업 4, 5

**예상 파일:**
- `docs/features/philosophia.md`
- `docs/todo.md`
- `CLAUDE.md`

**규모:** XS

## 위험과 대응

| 위험 | 영향 | 대응 |
|------|------|------|
| 공용화하면서 철학시가 description이 바뀜 | 중 | 기존 `philosophiaDescription` 테스트를 수정 없이 통과시키고, 상세 HTML meta description을 변경 전후 비교 |
| 일반 영상 출력이 의도치 않게 바뀜 | 중 | 분기를 `isShorts` 한 곳으로 모으고, 작업 시작 전 일반 영상 HTML을 저장해 diff |
| 숏츠 본문 형식이 실측 2종과 다른 글(마크다운 `*`, 프로필 bullet 등) | 하 | 줄 제거 규칙은 보수적으로(URL·공통 문구만). 남는 `*` 등은 수용 — 제목이 앞에 오므로 스니펫 핵심은 유지 |
| 전체 `npm run lint`가 기존 오류로 실패 | 하 | 변경 파일 기준으로 판정, 전체 결과는 참고로 기록 |

## 열린 질문

없음
