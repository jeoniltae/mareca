# 구현 계획: 유튜브 영상 게시판 상세 — VideoObject JSON-LD 추가

- spec: ./spec.md
- 상태: 리뷰 완료

## 개요

`src/lib/json-ld.ts`에 유튜브용 `youtubeVideoObjectJsonLd` 헬퍼를 추가하고, ReformedTV·철학시가 상세 페이지에서
영상이 있을 때만 기존 `Article` `<script>` 아래에 `VideoObject` `<script>`를 하나 더 출력한다.
곁다리로 ReformedTV `generateMetadata`에 board 필터를 넣는다. 화면·플레이어·DB·폼은 바꾸지 않는다.

## 설계 결정

- **헬퍼는 `thumbnailUrl`을 인자로 받는다** — `src/lib/`는 지금까지 `@/features`를 import한 적이 없다(조사 결과 0건).
  헬퍼 안에서 `getYoutubeThumbnail`을 부르면 lib → features 역방향 의존이 생기므로, 두 페이지가 이미 하던 대로
  `getYoutubeThumbnail(videoId)`를 계산해 넘긴다. spec의 "getYoutubeThumbnail 재사용"은 그대로 지켜진다.
  입력: `{ title, description, videoId, thumbnailUrl, uploadDate? }`
- **`embedUrl`은 헬퍼가 videoId로 조립한다** — 유튜브 embed URL 형식은 한 곳에서만 알게 한다
- **description 빈 값 → title 대체는 헬퍼가 책임진다** — 두 페이지가 각자 처리하지 않게. 테스트로 고정
- **Article의 description 계산은 건드리지 않는다** — ReformedTV 상세는 Article에 `content?.slice(0, 120)`(공백 정리 없음)을
  쓰고 있지만, 이번 변경 범위가 아니다(외과적 변경). VideoObject에는 `generateMetadata`와 같은 정리된 값을 쓴다
- **철학시가는 `philosophiaDescription(post.content, post.title)`을 그대로 넘긴다** — Article과 같은 값
- **커밋은 작업 단위로** — `.claude/feature-workflow.md` BUILD 규칙(`coding-guidelines.md` §9). push는 SHIP에서

## 작업 목록

### 1단계: 기반
- [x] 작업 1: `youtubeVideoObjectJsonLd` 헬퍼 + 단위 테스트

### 체크포인트: 기반
- [x] `npx vitest run` 통과 (기존 테스트 포함)
- [x] `npx tsc --noEmit` 통과

### 2단계: 페이지 적용
- [x] 작업 2: ReformedTV 상세에 VideoObject 출력
- [x] 작업 3: ReformedTV `generateMetadata` board 필터
- [x] 작업 4: 철학시가 상세에 VideoObject 출력

### 체크포인트: 페이지 적용
- [x] `npx vitest run` · `npm run lint` · `npx tsc --noEmit` · `npm run build` 통과
      — lint는 변경 파일 4개 기준 통과. 전체 `npm run lint`는 건드리지 않은 파일의 기존 오류 15건으로 실패(이번 변경과 무관)
- [x] 두 게시판 상세 HTML에서 VideoObject 확인, 화면 동작 변경 없음 — 전체 96건 HTML 검사 + 브라우저(agent-browser, 390px) 화면·재생 확인
- [x] 사용자 확인 후 다음으로 진행

### 3단계: 문서
- [x] 작업 5: 문서 갱신 (`CLAUDE.md` SEO 가이드 · `docs/todo.md` · `docs/features/philosophia.md`)

### 체크포인트: 완료
- [ ] spec 성공 기준 중 배포 전 항목 모두 충족 — "영상 없는 글에 VideoObject 없음" 1건만 미실측(실데이터 96건 전부 영상 있음, `videoId &&` 조건으로만 보장). 나머지 충족
- [x] REVIEW 준비됨

## 작업 상세

#### 작업 1: `youtubeVideoObjectJsonLd` 헬퍼 + 단위 테스트

**설명:** `src/lib/json-ld.ts`의 Mux용 `videoObjectJsonLd` 바로 아래에 유튜브용 헬퍼를 추가한다.
출력은 `@context`, `@type: VideoObject`, `name`, `description`(빈 값이면 title), `thumbnailUrl`, `uploadDate`,
`embedUrl`(`https://www.youtube.com/embed/{videoId}`). `contentUrl`은 넣지 않는다.
`src/lib/json-ld.test.ts`를 새로 만든다(첫 줄 한국어 주석, `content-meta.test.ts`와 같은 `import { describe, it, expect } from 'vitest'` 형식).

**완료 기준:**
- [x] 헬퍼가 named export로 추가되고, 기존 `videoObjectJsonLd`·`articleJsonLd`는 변경 없음
- [x] 테스트가 `embedUrl` 조립, `thumbnailUrl` 전달, `contentUrl` 부재, 빈 description → title 대체를 검증
- [x] 테스트 통과

**검증:**
- [x] `npx vitest run`
- [x] `npx tsc --noEmit`

**의존:** 없음

**예상 파일:**
- `src/lib/json-ld.ts`
- `src/lib/json-ld.test.ts` (신규)

**규모:** XS

#### 작업 2: ReformedTV 상세에 VideoObject 출력

**설명:** `src/app/community/reformed-tv/[id]/page.tsx`에서 기존 Article `<script>` 바로 아래에
`videoId &&` 조건으로 두 번째 `<script type="application/ld+json">`를 출력한다(`club-news/news/[id]/page.tsx`의 Mux 패턴과 동일).
description은 `generateMetadata`와 같은 식(태그 제거 → 공백 정리 → trim → 120자), uploadDate는 `post.created_at`.

**완료 기준:**
- [x] 영상 있는 글의 HTML에 `"@type":"VideoObject"`가 정확히 1개, `embedUrl`의 ID가 그 글의 영상 ID와 일치
- [ ] 영상 없는(또는 파싱 실패) 글에는 VideoObject 없음 — `videoId &&` 조건으로 보장. 실데이터(ReformedTV 81·철학시가 15건)가 전부 영상 있는 글이라 실측 불가
- [x] 화면·플레이어 동작 변경 없음 — 브라우저에서 썸네일 렌더 → 재생 클릭 → youtube-nocookie iframe 생성 확인

**검증:**
- [x] `npx tsc --noEmit` · `npm run lint` — lint는 변경 파일 기준
- [x] 수동 확인: `npm run dev` → 목록에서 글 id 하나를 골라 `curl -s http://localhost:3000/community/reformed-tv/<id>`의 출력에서
      `VideoObject` 개수와 `embedUrl` 확인. 브라우저로 열어 썸네일 → 클릭 → 재생 확인
      — curl(전체 81건 VideoObject 1개·embedUrl ID 일치) + 브라우저 재생 확인 완료

**의존:** 작업 1

**예상 파일:**
- `src/app/community/reformed-tv/[id]/page.tsx`

**규모:** XS

#### 작업 3: ReformedTV `generateMetadata` board 필터

**설명:** `generateMetadata`의 조회에 `.eq('board', 'reformed-tv')`를 추가한다. 다른 게시판 글 id로 이 경로를 요청했을 때
그 글의 제목·설명이 메타데이터로 새는 것을 막는다(철학시가와 동일한 격리).

**완료 기준:**
- [x] 다른 board 글 id 요청 시 `<title>`이 그 글 제목이 아니다(본문은 기존대로 not-found)
- [x] 자기 board 글은 기존과 같은 `<title>`·description

**검증:**
- [x] `npx tsc --noEmit`
- [x] 수동 확인: 철학시가 글 id로 `curl -s http://localhost:3000/community/reformed-tv/<철학시가 id>` → `<title>` 확인

**의존:** 없음 (작업 2와 같은 파일이라 순서상 뒤에 둔다)

**예상 파일:**
- `src/app/community/reformed-tv/[id]/page.tsx`

**규모:** XS

#### 작업 4: 철학시가 상세에 VideoObject 출력

**설명:** `src/app/community/philosophia/[id]/page.tsx`의 Article `<script>` 바로 아래에 작업 2와 같은 방식으로 출력한다.
description은 `philosophiaDescription(post.content, post.title)`. 다크 톤 마크업은 건드리지 않는다.

**완료 기준:**
- [x] 영상 있는 글의 HTML에 `"@type":"VideoObject"` 1개, `embedUrl` ID 일치
- [x] description이 Article의 description과 같은 값
- [x] 화면(다크 톤)·플레이어 동작 변경 없음 — 브라우저에서 다크 톤 렌더 → 재생 클릭 → iframe 생성 확인

**검증:**
- [x] `npx tsc --noEmit` · `npm run lint` · `npm run build` — lint는 변경 파일 기준
- [x] 수동 확인: `curl -s http://localhost:3000/community/philosophia/<id>`로 VideoObject 확인, 브라우저로 화면·재생 확인
      — curl(전체 15건 VideoObject 1개·embedUrl ID 일치) + 브라우저 화면·재생 확인 완료

**의존:** 작업 1

**예상 파일:**
- `src/app/community/philosophia/[id]/page.tsx`

**규모:** XS

#### 작업 5: 문서 갱신

**설명:** `CLAUDE.md` "SEO 운영 가이드 › 자동 처리"에 `JSON-LD (VideoObject)` 한 줄 추가(유튜브: ReformedTV·철학시가 / Mux: 클럽소식),
"관련 파일"의 `json-ld.ts` 헬퍼 목록에 `videoObjectJsonLd`·`youtubeVideoObjectJsonLd` 추가.
`docs/todo.md` 완료 섹션에 항목 추가, `docs/features/philosophia.md` 후속 작업에 VideoObject 적용 기록.

**완료 기준:**
- [x] 세 문서에 반영되고 서로 어긋나는 서술이 없다
- [x] 한국어 문장 끝 콜론 없음 (`coding-guidelines.md` §5)

**검증:**
- [x] 수동 확인: `git diff --stat`으로 세 문서만 바뀌었는지, 각 diff 육안 확인

**의존:** 작업 2·3·4

**예상 파일:**
- `CLAUDE.md`
- `docs/todo.md`
- `docs/features/philosophia.md`

**규모:** XS

## 리뷰 결과 (2026-11-02)

`code-review`(medium, `bd3bff8..HEAD`) + `security-review` + 프로젝트 REVIEW 체크리스트 대조. 사용자 결정에 따라 처리했다.

| # | 발견 | 심각도 | 처리 |
|---|---|---|---|
| 1 | JSON-LD `</script>` 탈출 저장형 XSS — 새 VideoObject 스크립트 2곳 (같은 패턴이 기존 Article 17개 라우트·`layout.tsx`에도 있음) | 상 | **수정(A)** — `toJsonLdHtml()` 헬퍼 추가(`<` → `\u003c`) + 테스트 2건, 두 상세 페이지의 Article·VideoObject 4곳 적용. **나머지 라우트(B)는 별도 fix** → `docs/todo.md` 미착수 |
| 2 | 철학시가 상세에서 `philosophiaDescription()` 이중 계산 | 하 | **수정** — `description` 한 번 계산해 Article·VideoObject에 공유 |
| 3 | `uploadDate` 누락 가능 (`created_at` nullable 타입) | 하 | 수용 — DB 기본값으로 실제로 비지 않음, 실데이터 96건 전부 있음 |
| 4 | 본문 빈 글의 meta·VideoObject description 대체 문구 불일치 | 하 | 수용 — 둘 다 유효한 값, 실데이터에 해당 글 없음 |
| 5 | ReformedTV Article description이 공백 정리 없는 raw slice | 하 | 수용 — 기존 동작, 범위 밖 |
| 6 | Mux·유튜브 VideoObject 헬퍼 중복 | 하 | 수용 — spec 설계 결정 |
| 7 | 썸네일 320×180(mqdefault) | 하 | 수용 — 구글 최소 60×30 충족, `getYoutubeThumbnail`은 공용 |
| 8 | `extractYoutubeId` 형식 검증 없음 | 하 | 수용 — 폼에서 썸네일 존재 검증, 실데이터 96건 정상 ID |

프로젝트 체크리스트 — `coding-guidelines.md` "하지 말아야 할 것" 위반 없음, 접근 제한 경로 변경 없음.
"`dangerouslySetInnerHTML` 사용자 입력 경로" 항목이 #1에 해당 → 수정함.

수정 후 재검증 — `verify.md` "리뷰 수정 후 재검증" 참고.

## 위험과 대응

| 위험 | 영향 | 대응 |
|------|------|------|
| 구글이 영상을 "페이지의 주 콘텐츠"로 보지 않아 영상 리치 결과가 안 나옴 | 중 | 코드로 통제 불가. 배포 후 Rich Results Test·Search Console "동영상" 보고서로 확인 (spec 성공 기준 마지막 항목, 사용자 몫) |
| 지연 로드 플레이어라 구글이 "페이지에 영상이 안 보인다"고 판단 | 중 | 구글은 썸네일 + 재생 버튼 구조를 대체로 인정한다. 보고서에 "동영상이 페이지에 표시되지 않음"이 뜨면 후속으로 검토 (spec 비목표) |
| JSON-LD `<script>`에 `JSON.stringify` 결과를 그대로 넣어 제목·본문의 `</script>` 문자열이 태그를 닫을 수 있음 | **상** (계획 시 "하"로 과소평가 — 누구나 가입·글쓰기 가능해 저장형 XSS) | REVIEW에서 이 기능 범위(A)는 `toJsonLdHtml`로 수정. 나머지 라우트(B)는 `docs/todo.md` 미착수로 등록, 별도 fix |
| `uploadDate`가 유튜브 실제 업로드일이 아닌 게시글 작성일 | 하 | 구글은 "페이지에 영상이 게시된 날"로 받아들인다. spec에서 확정 |

## 열린 질문

없음
