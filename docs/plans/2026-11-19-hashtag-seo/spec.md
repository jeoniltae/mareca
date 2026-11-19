# 본문 해시태그 SEO 활용 — ReformedTV 숏츠 · 최더함의 철학시가

- 작성일: 2026-11-19
- 상태: 승인됨

## 배경 / 문제

ReformedTV 숏츠와 철학시가 게시물 본문 끝에 `#태그`를 나열해 두었지만, 화면에 평문으로 출력될 뿐 SEO에는 거의 쓰이지 않는다.
구글은 웹페이지의 `#`에 의미를 두지 않으므로 태그는 본문 단어 이상의 효과가 없다.

- **철학시가** — 2026-08-29 작업(`docs/features/philosophia.md` "SEO — description 중복 해소 + JSON-LD keywords")에서
  `philosophiaDescription`(태그 제거)과 Article JSON-LD `keywords`는 이미 적용됐다. 남은 빈틈은 두 가지다.
  - VideoObject JSON-LD에 `keywords`가 없다
  - 카카오톡 공유 description(`ShareButtons`)에 원문(태그 포함)이 그대로 넘어간다
- **ReformedTV 숏츠** (실측, 2026-11-19 — 숏츠 58건 중 태그 있는 글 20건 / 일반 32건 중 2건)
  - 본문 구조: `강의명 2줄` → `채널 URL` → `Soli Deo Gloria / Semper Reformanda` → `#태그 16개 안팎`
  - description이 본문 앞 120자 단순 절단이라 **채널 URL이 들어가고**, 태그는 JSON-LD에 쓰이지 않는다
  - **같은 강의에서 잘라낸 숏츠끼리 본문이 글자 그대로 같다** (예: "사람은 죽어도 진리는 죽지 않는다" / "왜 교황을 따르지 않는가")
    → description 중복. 철학시가가 8월에 겪은 것과 같은 문제다
- `docs/todo.md`에 같은 주제의 미착수·보류 항목은 없다.

## 목표

1. ReformedTV 숏츠의 description을 글마다 고유하고 의미 있는 문장으로 만든다 (`{제목} — {정리된 본문}`)
2. 숏츠·철학시가 본문의 `#태그`를 Article·VideoObject JSON-LD `keywords`로 노출한다
3. 검색 스니펫·카카오 공유 미리보기에 `#태그` 나열이 나오지 않게 한다
4. 해시태그 추출 로직을 한 곳(공용 모듈)으로 모은다

## 비목표 (이번에 하지 않는 것)

- 태그를 링크로 만들기 / 태그별 목록 페이지 — 태그당 글이 적어 thin content 위험. 게시물이 쌓인 뒤 검토
- ReformedTV **일반 영상**의 description 변경 — 현재 동작 유지 (사용자 결정)
- 게시물 본문 수정 (화면의 태그 표시는 그대로)
- 태그 개수 제한 — 구글은 `keywords`를 무시하고 다른 엔진에는 해가 없어 자를 이유가 없음
- 숫자만 있는 태그(`#1`) 제외 규칙 — 처음 제안했으나, 철학시가 기존 정규식(`/#[^\s#]+/g`)을 그대로 공용화해 기존 동작을 바꾸지 않기로 함

## 사용자 시나리오

1. **검색 사용자** → 구글에서 숏츠 상세가 노출될 때 → 스니펫을 보고 → `왜 교황을 따르지 않는가 — 최더함 목사의 기독교 100문 100답 제26강…`처럼 제목과 강의명이 보인다(태그·URL 없음)
2. **검색 엔진 크롤러** → 숏츠 상세 HTML을 읽고 → Article·VideoObject JSON-LD에서 `keywords` 배열(태그에서 `#` 제거)을 확인한다
3. **같은 강의의 숏츠 두 개** → 상세 페이지 meta description을 비교하면 → 제목이 달라 서로 다르다
4. **방문자** → 숏츠/철학시가 상세에서 카카오톡 공유를 누르면 → 미리보기 설명에 `#태그`가 나오지 않는다
5. **방문자** → ReformedTV **일반 영상** 상세를 보면 → meta·JSON-LD 출력이 변경 전과 같다
6. **방문자** → 숏츠·철학시가 상세 본문 하단에서 → `#태그`가 이전처럼 그대로 보인다

## 설계 요약

**숏츠 description 규칙** (대화에서 확정 — "제목 + 본문" 안)
- 형식 `{제목} — {정리된 본문}`, `truncateAtSentence`로 120자 문장 경계 절단
- 정리: `#태그` 제거, URL 포함 줄 제거, 채널 공통 문구 줄(`마스터스 Reformed TV`, `Soli Deo Gloria`, `Semper Reformanda`) 제거, 공백 정리
- 공통 문구는 철학시가 `BOILERPLATE`처럼 **줄 단위 건너뛰기** — 문구가 바뀌어도 그 줄이 남을 뿐 깨지지 않음
- 정리 후 본문이 비면 `{제목} — 마스터스개혁파총회 ReformedTV 숏츠`
- 한 번 계산해 meta·OG·Twitter·Article·VideoObject·카카오 공유에 같은 값 사용
- `category === '숏츠'`일 때만 적용 (대화에서 확정 — 일반 영상 제외)

**코드 구조**
- `src/lib/hashtags.ts` 신규 — `extractHashtags(content)`: `#` 제거·중복 제거. 철학시가 `HASHTAG`·`philosophiaKeywords`를 옮긴 것
- `src/features/philosophia/content-meta.ts` — 공용 모듈 import로 교체, `philosophiaDescription` 결과 불변
- `src/features/reformed-tv/content-meta.ts` 신규 — `shortsDescription(content, title)`
- `src/lib/json-ld.ts` — `youtubeVideoObjectJsonLd`에 `keywords?: string[]`, 비면 필드 생략 (`articleJsonLd`와 동일 방식)

검토했지만 버린 안
- 태그만 제거 — 같은 강의 숏츠의 description 중복이 남음
- 태그 + URL 제거 — 중복이 남음
- `src/lib/hashtags.ts`를 새로 만들고 철학시가는 그대로 두기 — 같은 정규식이 두 곳에 생김

## 영향 범위

- 화면: `/community/reformed-tv/[id]`(숏츠만), `/community/philosophia/[id]` — 메타태그·JSON-LD·카카오 공유 설명. 렌더되는 본문은 불변
- 코드: `src/lib/hashtags.ts`(신규), `src/lib/json-ld.ts`, `src/features/reformed-tv/content-meta.ts`(신규), `src/features/philosophia/content-meta.ts`, 두 상세 `page.tsx`, 관련 테스트
- `youtubeVideoObjectJsonLd` 사용처는 위 두 상세뿐 — 선택 파라미터라 호출부 수정 없이 호환
- 데이터: DB 변경 없음, DDL·`db:types` 불필요
- 문서: `docs/features/philosophia.md`, `docs/todo.md`, `docs/context-notes.md`, (헬퍼 설명이 바뀌면) `CLAUDE.md` SEO 가이드

## 성공 기준

- [ ] 숏츠 상세 meta description이 `{제목} — …` 형식이고 `#`·`http`를 포함하지 않는다
- [ ] 본문이 같은 숏츠 두 건의 description이 서로 다르다
- [ ] 숏츠 상세의 Article·VideoObject JSON-LD에 `keywords`가 있고 본문 태그와 일치한다
- [ ] 일반 영상 상세의 meta description·JSON-LD가 변경 전과 같다 (`keywords` 없음)
- [ ] 철학시가 상세의 VideoObject JSON-LD에 `keywords`가 있고, description은 변경 전과 같다
- [ ] 숏츠·철학시가의 카카오 공유 description에 `#`가 없다
- [ ] 상세 본문 화면의 `#태그` 표시가 그대로다
- [ ] `npx vitest run`, `npm run lint`, `npm run build` 통과

## 열린 질문

없음
