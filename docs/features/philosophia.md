# 최더함의 철학시가 — 작업 기록

`/community/philosophia` 게시판의 설계 결정과 단계별 체크리스트.
`docs/todo.md`에서 분량이 커져 분리했다. 상태 표기 규칙은 `docs/todo.md`와 같다.

관련 문서 — 코딩 규칙: `../coding-guidelines.md` / 작업 결정 기록: `../context-notes.md` / 작업 목록: `../todo.md`

---

## [완료] 게시판 추가 — 최더함의 철학시가 (1차: 목록 화면 디자인)

- 개요: 최더함 목사의 '철학시가' 영상 아카이브. 시를 AI 작곡 곡조와 함께 듣는 새 장르를 소개하는 코너
- 경로 `/community/philosophia`, `board='philosophia'` — `posts.board`/`category`는 자유 문자열이라 **DB 마이그레이션 불필요**
- 1차 범위는 **목록 화면 디자인만**. DB 연동·상세·등록·수정은 디자인 확정 후 2차
- 디자인 방향 — **다크 포레스트 에디토리얼**
  - ReformedTV(화이트 + sky-600 + 라운드 카드 + Noto Sans)와 정반대 축으로 잡아 차별화한다
  - **확정 팔레트 — 딥 잉크 네이비.** 히어로 `#182B4E` / 그리드 `#14243F` / 호버 `#20365E` / 썸네일 `#101D34` / 골드 `#D9B441` / 크림 `#EDE7D6`
  - **임의 선택이 아니라 위 「로고 기반 브랜드 컬러 시스템」 항목의 로고 추출 컬러**(네이비 `#1C2E50`)에서 가져왔다. 이 페이지가 그 미착수 항목의 선행 파일럿이 된다
- 색상 결정 경위 (2026-08-27, 3회 반복)
  1. 1차 — 딥 포레스트 `#13251C`/`#101F17` + 브랜드 골드 `#C8A224`. 로고 그린에서 출발
  2. 2차 — "어둡다"는 피드백으로 명도를 한 단계 올림. 그린 `#1E3A2C`/`#1A3226`, 골드는 밝아진 배경에서 묻히지 않게 `#D9B441`로. 크림 계열 저투명도 값도 함께 상향(헤어라인 `/10 → /15`, 메타 `/35 → /50` 등)
  3. 3차 — **그린 → 네이비로 색상(hue) 자체를 교체.** 그린의 관습적 연상은 자연·생명·성장인데, 연작 주제가 존재·유한·자아·시간·종말이라 방향이 어긋났다. 특히 딥그린+골드는 위스키 라벨·컨트리 클럽 쪽으로 읽혀 '사유'를 전달하지 못한다. 네이비는 밤·내면의 색이라 `내가 나를 묻는 밤` 같은 제목과 같은 말을 한다
  - 당초 "네이비는 `PageHeader`의 `slate-800`과 겹칠 위험"을 이유로 배제했으나 과한 우려였다. `slate-800`은 채도가 거의 없는 청회색이고 `#182B4E`는 채도가 살아 있어 구분된다. ReformedTV와의 차별화는 색이 아니라 **구조**(라운드 0, 헤어라인 격자, 명조+모노, 텍스처, 넘버링)가 대부분 감당한다
  - 3안(딥 포레스트 / 딥 잉크 네이비 / 웜 블랙+크림) 비교 시트를 Artifact로 만들어 육안 선택함 — https://claude.ai/code/artifact/5ce91d8f-3161-4276-afd4-68fd7cc62f8a
  - 골드·크림·구조·서체는 3안 내내 고정. 바뀐 건 바탕 4단계뿐이라 되돌리는 비용이 거의 없다
  - 라운드 0. 카드 그림자 없이 1px hairline 그리드로만 구분
  - 국문 명조(Gowun Batang) + 라틴·숫자 모노(IBM Plex Mono) — `01 02 03` 대형 넘버링, `008 ENTRIES` 제로 패딩 카운트
  - 가로 rule(오선) 텍스처 + 도트 그리드로 질감
  - `PageHeader`를 쓰지 않고 **전용 히어로**를 만든다 — 이게 차별화의 절반. breadcrumb은 동일하게 유지
- 1단계 — 목업 데이터
  - [x] `src/features/philosophia/mock-videos.ts` — 연작 8건(존재/유한/자아/시간/로고스/섭리/언어/종말). 일반 5 · 숏츠 3
  - [x] 실제 유튜브 URL 없이 시안형 플레이스홀더(오선 패턴 + 재생 아이콘)로 렌더 — 썸네일 유무 양쪽 레이아웃을 함께 검증하기 위함
- 2단계 — 폰트
  - [x] `src/features/philosophia/fonts.ts` — 페이지 전용으로 분리. **`layout.tsx` 전역은 건드리지 않는다**(이 페이지에만 번들)
  - [x] `display: 'swap'` 사용 — 프로젝트 관행은 `optional`이지만, 디자인을 지탱하는 디스플레이 폰트라 미적용 위험을 피한다
- 3단계 — 전용 히어로
  - [x] `src/features/philosophia/PhilosophiaHero.tsx` — 모노 킥커(`철 학 시 가 · PHILOSOPHIA`) + 대형 명조 타이틀 + 골드 룰 + breadcrumb, 우측 골드 번호매김 인트로 2줄
- 4단계 — 목록 페이지
  - [x] `src/app/community/philosophia/page.tsx` — 텍스트형 카테고리 탭(전체/일반/숏츠) + `NNN ENTRIES` + 골드 아웃라인 [영상 등록]
  - [x] hairline 그리드(컨테이너 `border-t border-l` + 셀 `border-b border-r`) — 8건이라 1·2·4열 모두 행이 꽉 차 가장자리가 깨지지 않는다
  - [x] 호버 시 좌측에서 자라나는 골드 룰 + 진입 stagger(CSS `animation-delay`, Framer Motion 미사용 — Server Component 유지)
  - [x] `metadata` 추가 (CLAUDE.md SEO 가이드: 새 정적 페이지 필수)
- 5단계 — GNB 등록
  - [x] `Header.tsx` 커뮤니티 서브메뉴 — **ReformedTV 바로 다음**에 배치
- 6단계 — 검증
  - [x] `npm run build` 통과
  - [x] `npx eslint`로 신규 4개 파일 + 수정 1개 파일(`Header.tsx`)만 검사 — 깨끗함.
    `Header.tsx`에 뜨는 2건(`set-state-in-effect` 187행, `no-img-element` 258행)은 **기존 이슈**로 이번 한 줄 추가와 무관하다
  - [x] 사용자 수동 검증 — 375 / 768 / 1440px 육안 확인 (2026-08-28 완료)
- 7단계 — 수동 검증 중 나온 수정 (2026-08-28)
  - [x] **유틸 텍스트 크기 상향** — 킥커·breadcrumb·인트로 라벨·탭·`ENTRIES`·등록 버튼·연작 라벨·카드 메타가 10~12px이라 가독성이 떨어졌다. 13~16px로 올리고 **자간을 함께 줄였다**(킥커 `0.42 → 0.3em`, 카드 메타 `0.14 → 0.08em` 등).
    모노 서체는 커질수록 자간이 그대로면 글자가 흩어져 오히려 읽기 나빠진다. 값은 전부 고정 px이라 모바일에도 동일 적용된다.
    킥커만 반응형(`13px/0.3em` → sm `14px/0.36em`) — 375px에서 줄바꿈을 막기 위함이며 크기가 아니라 자간만 조절했다
  - [x] **모바일 툴바 배치** — 모바일에서 [영상 등록]이 둘째 줄로 밀려 좌측에 고아로 남았다.
    **풀 너비 버튼은 채택하지 않았다** — 등록은 2차에서 로그인 사용자만 보는 소수 동선인데 최대 면적을 주면 위계가 뒤집히고, 헤어라인 기반 에디토리얼 톤에서 가장 시끄러운 요소가 되어 일부러 벗어난 '표준 게시판' 인상으로 되돌아간다. ReformedTV·오픈강좌도 컴팩트 버튼이다
    - 원인은 버튼이 아니라 `008 ENTRIES`(≈115px)가 줄을 넘긴 것. **조작 요소가 아닌 캡션인 `ENTRIES`를 내리고 탭+버튼을 한 줄에 유지**했다
    - `order` + `w-full`로 순서만 바꿔 **버튼 마크업을 중복시키지 않았다**. `sm:hidden`/`hidden sm:flex`로 두 번 쓰면 2차에서 로그인 체크를 붙일 때 두 곳을 고쳐야 한다
    - 버튼에 `ml-auto`가 있어 320px처럼 더 좁아져 줄이 밀려도 우측 정렬로 떨어진다 (좌측 고아 재발 방지)
  - [x] IDE가 지적한 Tailwind 비정규 클래스 3건 정규형 교체 — `sm:order-none → sm:order-0`,
    `[animation-duration:600ms] → animation-duration-[600ms]`, `[animation-fill-mode:backwards] → fill-mode-[backwards]`.
    교체 후 빌드 CSS에 `@keyframes enter`·`animation-fill-mode:backwards`·stagger `animation-delay:.49s`가 그대로 남아 있는지 재확인함
- 2차 잔여 작업 → 아래 **[미착수] 최더함의 철학시가 (2차)** 항목으로 분리했다

---

## [완료] 게시판 추가 — 최더함의 철학시가 (2차: DB 연동 · 상세/등록/수정 · SEO) — 2026-08-29

- 기능 명세는 **ReformedTV와 동일**하다. 아래는 `src/app/community/reformed-tv/*`, `src/features/reformed-tv/*`를 전수 확인해 1:1 대응시킨 목록이다
- 1차(목록 화면 디자인)는 완료. 위 항목 참조
- **남은 확인 1건 — 8단계 (7)번(페이지네이션 2페이지·넘버링 이어짐)은 글이 12건을 넘어야 확인된다.**
  코드는 들어가 있고(`String(from + i + 1)`) 나머지 검증은 모두 통과했다. 글이 쌓이면 확인할 것

### 확정 사항 (2026-08-28 사용자 결정)

- **다크 톤 적용 범위 — B안.** 목록 + 상세까지 다크, 등록·수정 폼은 기존 라이트를 그대로 쓴다.
  공개 화면(비로그인도 보는 곳)은 톤이 일관되고, 관리 동선인 폼은 기존 자산을 재사용한다
  - 파생 작업 — 상세 페이지도 `PageHeader`를 못 쓰므로 **`PhilosophiaHero`에 `title` / `breadcrumbs` prop을 받도록 일반화**하는 선행 작업이 생긴다
  - 파생 작업 — 상세에서 쓰는 `ShareButtons`·`BackToListLink`가 라이트 톤이라 다크 배경 위 대비를 따로 봐야 한다
- **연작 라벨 — 사용하지 않는다.** `posts`에 컬럼을 추가하지 않고, 카드 우측 상단 연작 라벨은 디자인에서 **제거**한다.
  DB 마이그레이션이 전부 사라져 `npm run db:types` 재생성도 불필요하다
- **카테고리 — `일반` / `숏츠` 유지.** ReformedTV와 동일
- **`PAGE_SIZE = 12`.** ReformedTV와 동일
- DB는 `board='philosophia'`가 자유 문자열이라 **테이블·RLS·GRANT 변경이 전혀 없다** (1차 확인 완료)

### 1단계 — `YoutubePlayer`를 `features/youtube/`로 이동 (선행 · 독립 커밋)

현재 `features/reformed-tv/YoutubePlayer.tsx`에 있어, 이미 오픈강좌가 교차 참조 중이다.
철학시가까지 붙으면 3개 기능이 남의 슬라이스를 참조하게 되므로 **철학시가 작업 전에 먼저 정리한다.**
다른 게시판을 건드리는 작업이라 **철학시가 커밋과 반드시 분리**한다.

- **1-A. 영향 범위 조사 (수정 전) — [완료] 2026-08-28**
  - [x] `grep -rn "YoutubePlayer" src` — import·사용처 전수 확인
  - [x] `grep -rn "features/reformed-tv" src` — 슬라이스 외부 참조 전수 확인
  - [x] `grep -rn "react-lite-youtube-embed" src` — 의존성이 이 파일 밖에서도 쓰이는지 확인
  - [x] `ls src/features/reformed-tv` — **배럴 `index.ts` 없음.** 재export를 타고 깨질 경로가 없다
  - [x] src 밖(설정·빌드 스크립트·테스트) 참조 검사 — **코드 참조 0건.**
    `docs/*.md` 히트는 산문 서술이라 이동과 무관하다
  - [x] 동적 `import()` · `lazy()` 사용 여부 — **없음.** 정적 import뿐이라 grep으로 전수가 잡힌다
  - **조사 결론 — 영향받는 파일은 아래 2개뿐이다**
    - `src/app/community/open-lecture/[id]/page.tsx:12` (import) · `:189` (사용) ← **오픈강좌. 이미 교차 참조 중이라 이번 이동으로 오히려 해소된다**
    - `src/app/community/reformed-tv/[id]/page.tsx:11` (import) · `:109` (사용)
    - 두 곳 모두 `<YoutubePlayer videoId={videoId} title={post.title} />`로 **호출 형태가 동일**하다
    - `react-lite-youtube-embed`와 그 CSS import는 `YoutubePlayer.tsx` 안에서만 쓰여 **파일과 함께 통째로 이동한다**
    - `features/youtube/`에는 `youtube-utils.ts` 하나뿐이라 **이름 충돌 없음**
    - props(`videoId`, `title`)·마크업은 **변경하지 않는다.** 순수 이동 + import 경로 갱신뿐이다
- **1-B. 이동 실행 — [완료] 2026-08-28**
  - [x] `git mv src/features/reformed-tv/YoutubePlayer.tsx src/features/youtube/YoutubePlayer.tsx` (이력 보존).
    `git status`가 `R`(rename)로 인식 — 이력이 끊기지 않았다
  - [x] 2개 파일의 import 경로를 `@/features/youtube/YoutubePlayer`로 수정
    (`reformed-tv/[id]/page.tsx:11`, `open-lecture/[id]/page.tsx:12`)
  - [x] 파일 상단 한국어 한 줄 주석 추가 (코딩 규칙 6항 — 이동 전에는 없었다). `'use client'` 바로 아래에 배치
  - [x] props·마크업·`react-lite-youtube-embed` import는 **한 줄도 바꾸지 않았다**
- **1-C. 회귀 확인 (수정 후) — 자동 검증 [완료] 2026-08-28**
  - [x] `grep -rn "features/reformed-tv/YoutubePlayer" src` — **0건** (잔여 참조 없음)
  - [x] `grep -rn "YoutubePlayer" src` — **이동 전 6건 → 이동 후 6건**으로 동일
    (정의 파일 2 = `interface` + `export function`, import 2, 사용 2)
  - [x] `npm run build` 통과
  - [x] `npx eslint` — 이동한 파일 + 수정한 2개 파일 깨끗함
  - [x] 런타임 검증 — `npm run dev`로 두 게시판 상세를 실제 요청해 확인
    - ReformedTV 상세 — `STATUS=200`, `lty-playbtn` 렌더 확인
    - 오픈강좌 상세 — 앞쪽 8건을 순회해 **유튜브가 있는 4건 전부 `lty-playbtn` 렌더 확인**.
      나머지 4건은 `youtube_url`이 없는 공지·기사형이라 플레이어가 안 나오는 게 정상이다
    - **`LiteYouTubeEmbed`의 CSS 청크가 두 페이지 모두에 로드**되는 것 확인
      (`node_modules_react-lite-youtube-embed_dist_LiteYouTubeEmbed_*.css`) — CSS import가 이동을 따라갔다
  - [x] 사용자 수동 — 두 화면에서 썸네일·재생 버튼 위치 정상 확인 (2026-08-28)
  - [x] **독립 커밋** — 사용자가 직접 수행 (2026-08-28). `be9ee1e` / `6c13bb6` / `6d71ffc` 3건으로 분리 커밋됨
- **1단계 [완료]** — 2단계부터는 철학시가 슬라이스 안에서만 작업하므로 다른 게시판에 영향이 없다

### 2단계 — Server Action — [완료] 2026-08-28
- [x] `src/features/philosophia/actions.ts` 신규 — `reformed-tv/actions.ts`를 그대로 대응시켰다
  - `createPhilosophiaPost` / `updatePhilosophiaPost` / `deletePhilosophiaPost`
  - `BOARD = 'philosophia'`, `BASE_PATH = '/community/philosophia'`
  - 비로그인 `redirect('/login')`, 수정·삭제는 `getIsAdmin()`이 false면 `.eq('user_id', user.id)` 추가, 성공 시 `revalidatePath`
  - 폼 필드명은 reformed-tv와 동일하게 유지 — `title` / `youtube_url` / `description`(→ `content` 컬럼) / `category`.
    5단계 `PhilosophiaForm`의 `name` 속성이 여기에 맞춰져야 한다
  - `create`·`update`는 이동할 id를 반환하고, `delete`만 `redirect(BASE_PATH)`로 목록에 보낸다 (reformed-tv와 동일)
- [x] **`incrementReformedTVViews`는 복제하지 않았다** — reformed-tv에 정의만 있고 호출부가 없는 dead code다.
  조회수는 `ViewTracker` → `features/posts/actions.ts`의 `incrementViews`가 처리한다
  (기존 dead code 자체는 요청 범위 밖이라 건드리지 않는다)
- [x] `npm run build` 통과 / `npx eslint` 깨끗함
- [x] export 대조 — reformed-tv 4개 중 dead code 1개를 뺀 **3개가 1:1 대응**함을 확인
- 아직 호출부가 없다(폼은 5단계). **동작 검증은 5단계 이후 8단계에서 한다**

### 3단계 — 목록 페이지 DB 연동 — [완료] 2026-08-28
- [x] `src/app/community/philosophia/page.tsx` 수정 — `MOCK_VIDEOS` → Supabase 쿼리
  - `select('id, title, youtube_url, views, created_at, category', { count: 'exact' })`
    + `.eq('board','philosophia')` + `created_at` 역순 + `.range(from, to)`, 카테고리 필터는 `.eq('category', ...)`
  - **`profiles(nickname)` 조인은 뺐다** — reformed-tv는 select에 넣어두고 목록에서 쓰지 않는다. 불필요한 조인이라 복제하지 않았다
  - `PAGE_SIZE = 12` 확정
  - `NNN ENTRIES` 카운트를 전체 `count`로 교체 (현재 페이지 건수가 아니라 총 건수)
  - `[영상 등록]` 버튼을 `supabase.auth.getUser()` 결과로 **로그인 사용자에게만 노출**
  - **카드 우측 상단 연작 라벨 제거** 완료. 상단이 넘버링 단독이 되면서 `justify-between` 래퍼가 불필요해져 함께 정리
  - **넘버링에 `from`을 더했다** — `String(from + i + 1)`. 2페이지가 `01`부터 다시 시작하지 않고 `13`으로 이어진다
  - **`STAGGER` 8개 → 12개 확장** (`PAGE_SIZE`와 일치). 빌드 CSS에 12개 값 전부 생성 확인
    (`0s` · `70ms` · `.14s` … `.7s` · `.77s` — 미니파이어가 짧은 표기로 변환한다)
  - 제목에 `line-clamp-2` 추가 — 실제 제목은 목업보다 길 수 있어 카드 높이가 들쭉날쭉해지는 것을 막는다
- [x] `src/features/philosophia/mock-videos.ts` **삭제** (`git rm`). 잔여 참조 0건 확인
- [x] **썸네일** — `videoId`가 있으면 `getYoutubeThumbnail()` 실제 이미지, 없으면 **오선 패턴 플레이스홀더 폴백 유지**
  - `next/image`는 쓰지 못한다 — `next.config.ts`의 `remotePatterns`에 `img.youtube.com`이 없다.
    설정은 전 사이트 공용이라 이번 범위에서 건드리지 않고, **reformed-tv와 동일하게 `<img>`를 썼다**
  - 그 결과 `@next/next/no-img-element` 경고 1건이 뜬다. **reformed-tv도 동일한 경고를 안고 있어 새로 만든 문제가 아니다**
  - 밝은 썸네일 위에서 재생 아이콘이 묻히지 않도록 **얇은 스크림**(`bg-[#101D34]/30`, 호버 시 `/10`)을 깔았다
- [x] **`PhilosophiaPagination.tsx` 신규** — 공용 `Pagination`을 쓰지 않았다
  - 공용 쪽은 `bg-slate-800` 활성 알약 · `hover:bg-slate-100`이라 **다크 네이비 위에서 흰 판이 뜬다**
  - 공용 컴포넌트는 24개 게시판이 함께 쓰므로 수정하지 않고, 이 코너 전용으로 분리했다
  - **페이지 윈도우 규칙(7개 초과 시 `...` 축약)은 공용과 동일하게 복제**해 동작 차이를 없앴다
  - 스타일은 목록 탭과 통일 — 활성 페이지는 골드 밑줄, 라운드 없음, 모노 숫자
  - 계획의 "파일 요약"에는 없던 신규 파일이다. 다크 대비 확인 항목이 실제로 문제로 확정되어 파생됐다
- [x] `npm run build` 통과 / `npx eslint` — 위 `no-img-element` 경고 1건 외 깨끗함
- [x] 런타임 확인 (`board='philosophia'`가 아직 빈 상태) — `STATUS=200`,
  `000 ENTRIES`(목업 8이 아닌 실제 count), `NO ENTRIES` 빈 상태, 비로그인 시 `[영상 등록]` 미노출,
  카테고리 필터(`?category=숏츠`) 정상, 페이지네이션 미렌더(1페이지 이하)
- [x] **이월분 해소 (2026-08-29)** — 실제 유튜브 썸네일 렌더·스크림 대비 정상(8단계 (2)),
  `line-clamp-2` 정상(8단계 (9)), 숏츠 세로 영상 썸네일도 16:9 카드에서 안 깨짐(8단계 (8))
- **미검증 — 글이 12건을 넘어야 확인 가능.** 8단계 (7)번에 남아 있다
  - 페이지네이션 2페이지 이상 동작 + 카테고리 필터와 `page` 파라미터 조합
  - **넘버링이 2페이지에서 `01`이 아니라 `13`으로 이어지는지** (`String(from + i + 1)`)

### 4단계 — 상세 페이지 (다크 — B안) — [완료] 2026-08-28
- [x] `PhilosophiaHero` 일반화 — `breadcrumbs` prop + `variant: 'full' | 'compact'`
  - **계획의 `title` prop은 넣지 않았다.** 히어로 제목은 항상 코너명(`최더함의 철학시가`)이라 상수다.
    쓰이지 않을 유연성을 추가하지 않는다(코딩 규칙 2항). 게시글 제목은 상세 본문의 `h1`이 맡는다
  - `full` = 목록(대형 타이틀 + 우측 인트로 2줄), `compact` = 상세(타이틀 축소, 인트로 없음, 패딩 축소)
  - **제목 태그를 분기**했다 — `full`은 `h1`, `compact`는 `p`.
    상세에서 코너명이 `h1`이면 게시글 제목(`h1`)과 충돌하고, `h2`로 두면 `h1`보다 앞서 나와 헤딩 순서가 뒤집힌다
  - breadcrumb 마지막 항목(게시글 제목)은 길어질 수 있어 `PageHeader`와 동일하게 **모바일에서 감춘다** + `line-clamp-1`
  - 타입은 `@/components/shared/PageHeader`의 `BreadcrumbItem`을 재사용 (새로 정의하지 않음)
- [x] `src/app/community/philosophia/[id]/page.tsx` 신규 — `reformed-tv/[id]/page.tsx` 대응
  - `generateMetadata` — title/description(태그 제거 후 120자)/OG/Twitter/canonical.
    OG 이미지는 유튜브 썸네일, 없으면 `/images/logo.png`
  - **`generateMetadata`에도 `.eq('board', BOARD)`를 넣었다** — reformed-tv는 여기에 board 필터가 없어
    다른 게시판 글의 제목·설명이 메타에 새어나갈 수 있다. 복제하지 않고 막았다
  - `YoutubePlayer`는 1단계에서 옮긴 `@/features/youtube/YoutubePlayer`에서 import
  - `ViewTracker`(`boardPath`) · `ShareButtons` · `BackToListLink` · `articleJsonLd` 배치
  - `isAuthor || isAdmin`일 때만 `PhilosophiaActions` 노출
  - 본문은 `whitespace-pre-wrap` 평문 렌더 — 폼이 평문 textarea라 HTML 주입 경로가 없다 (reformed-tv와 동일)
- [x] `src/features/philosophia/PhilosophiaActions.tsx` 신규 — 수정/삭제 + `ConfirmDialog` 2종.
  다크 배경용으로 직접 스타일링(라운드 pill + 헤어라인). 삭제는 `#E4736B` — `red-500`은 네이비 위에서 탁하다
- [x] **공용 컴포넌트 다크 대응 — 전부 하위 선택자로 덮어썼고 공용 파일은 한 줄도 수정하지 않았다**
  - `BackToListLink` — `className` prop을 받으므로 그대로 전달
  - `ShareButtons` — **`className` prop이 없다.** 카카오 버튼(`#FEE500`)은 다크에서도 읽히지만
    '링크 복사'는 `border-slate-200 text-slate-600`이라 묻힌다 → 래퍼에서 `[&_button:last-child]:…`로 덮었다.
    `:last-child`가 유일한 구분자라 **ShareButtons 버튼 순서가 바뀌면 깨진다**(현재 카카오 → 링크 복사 2개)
  - `YoutubePlayer` — `rounded-xl shadow-md`가 라운드 0 격자와 충돌 → 래퍼에서 `[&>div]:rounded-none [&>div]:shadow-none`
- [x] `npm run build` 통과 / `npx eslint` — 3단계의 `no-img-element` 경고 1건 외 깨끗함
- [x] 런타임 확인
  - 목록 회귀 — 히어로 prop 변경 후에도 `STATUS=200`, `h1` 1개, 인트로 정상 렌더
  - **board 격리** — reformed-tv 글 id를 philosophia 경로로 요청 시 not-found 렌더,
    **철학시가 상세 마크업 유출 0건**. 존재하지 않는 id도 동일
  - 다크 오버라이드 CSS(`button:last-child`, `rounded-none`, `shadow-none`) 생성 확인
  - **참고 — not-found가 HTTP 200으로 응답한다.** reformed-tv도 동일하게 200이라 **기존 동작이며 이번 변경과 무관**하다
    (별도 항목으로 다루지 않으면 방치되는 부분이라 기록만 남긴다)
- [x] **이월분 전부 해소 (2026-08-29, 8단계 수동 검증 (3)(4)(6))** — 글 등록 후 확인 완료
  - compact 히어로 렌더, 플레이어·설명·공유 레이아웃 정상
  - `ShareButtons` 링크 복사 버튼 다크 대비 정상 — 하위 선택자 덮어쓰기가 실제로 먹었다
  - 조회수 증가(`ViewTracker`), 수정·삭제 버튼 노출 조건 정상

### 5단계 — 등록 · 수정 페이지 (라이트 — B안 범위 밖) — [완료] 2026-08-28
- [x] `src/features/philosophia/PhilosophiaForm.tsx` 신규 — `ReformedTVForm` 대응. **기존 라이트 톤 그대로**
  - 필드: 카테고리(라디오 `일반`/`숏츠` 필수) · 유튜브 URL(필수, `extractYoutubeId`로 유효성 검사 + 썸네일 미리보기) ·
    제목(필수) · 설명(textarea, 선택). **연작 입력 필드 없음**
  - `mode: 'create' | 'edit'` 양용, 취소 시 `ConfirmModal` 확인, `isRedirectError` 재throw 처리
  - `sky-600` 계열을 그대로 뒀다 — B안이 "관리 동선은 기존 자산 재사용"이고, 사이트의 다른 폼 24개와 톤이 같아야 한다.
    여기만 골드·네이비로 바꾸면 반쯤 브랜딩된 폼이 되어 오히려 어색하다
  - placeholder 문구만 게시판 성격에 맞게 조정(`영상 제목` → `시가 제목`)
- [x] `src/app/community/philosophia/new/page.tsx` 신규 — 비로그인 `redirect('/login?next=…')`
- [x] `src/app/community/philosophia/[id]/edit/page.tsx` 신규 — 비로그인 리다이렉트 +
  `!post || (!isAdmin && post.user_id !== user.id)`이면 `notFound()`. 조회에 `.eq('board', BOARD)` 포함
- [x] **`PageHeader`에 배경 이미지를 넣지 않고 `bgColor="bg-[#182B4E]"`만 줬다**
  - `public/images/breadcrumb/`은 전부 개혁자 초상과 기념비라 '철학시가'와 맞는 이미지가 없다
  - 이미지 없이 네이비 단색으로 두면 **폼은 라이트지만 헤더 색으로 코너 정체성이 이어진다**(다크→라이트 경계 완충)
- [x] **1차의 `[영상 등록]` 링크 404 해소** — `/new` 라우트가 실제로 생겼다
- [x] `npm run build` 통과 — 4개 라우트 모두 생성(`/philosophia`, `/[id]`, `/[id]/edit`, `/new`)
- [x] `npx eslint` — `no-img-element` 경고 2건(목록 썸네일, 폼 미리보기)뿐.
  **`ReformedTVForm`도 동일한 경고를 안고 있어 새로 만든 문제가 아니다**
- [x] **폼 `name` ↔ `actions.ts` `formData.get()` 전수 대조** — `category`/`description`/`title`/`youtube_url` 4개 일치.
  특히 `description` → `content` 컬럼 매핑이 이름이 달라 놓치기 쉬운 지점이었다
- [x] 런타임 — 비로그인으로 `/new`·`/[id]/edit` 요청 시 **로그인 화면 렌더 + `NEXT_REDIRECT` 페이로드 확인,
  폼 필드 유출 0건**. reformed-tv 대조군과 동작 동일
  - not-found와 마찬가지로 HTTP는 200이다(Next.js RSC 리다이렉트 방식). reformed-tv도 같아 기존 동작이다
- [x] **등록 → 상세 이동, 수정 → 반영, 삭제 → 목록 복귀** — 확인 완료 (2026-08-29, 8단계 (1)(5))
- [x] **다크(목록·상세) → 라이트(폼) 전환 위화감 없음 확인** (2026-08-29, 8단계 (11)).
  `PageHeader`를 네이비 `bg-[#182B4E]`로 둔 완충이 유효했다

### 6단계 — 로딩 스켈레톤 (다크) — [완료] 2026-08-28
- [x] `src/features/philosophia/skeletons.tsx` 신규 — `PhilosophiaListSkeleton` / `PhilosophiaDetailSkeleton`
  - 공용 `components/shared/skeletons.tsx`는 **수정하지 않았다**(24개 게시판 공용). 참조도 0건
  - 한 파일 다중 export는 공용 `skeletons.tsx`의 기존 관행을 따른 것이다(코딩 규칙 3항 — 기존 스타일 유지)
  - 색은 목록·상세와 같은 토큰만 사용 — 바 `bg-[#EDE7D6]/10`, 썸네일·플레이어 자리 `bg-[#101D34]`, 배경 `bg-[#14243F]`.
    라운드 0과 헤어라인 격자도 실제 화면 그대로라 전환 시 형태가 바뀌지 않는다
- [x] **폴백 트리는 실제 페이지와 컴포넌트를 하나도 공유하지 않는다.** `skeletons.tsx`의 import 0건 —
  `PhilosophiaHero`도 `fonts.ts`도 쓰지 않고, 히어로 자리는 배경·텍스처·여백만 같은 껍데기(`HeroShell`)를 직접 그린다
  - **처음에는 반대로 만들었다** — "전환 시 흔들림을 없애려고" 폴백에 실제 `PhilosophiaHero`를 렌더했다.
    그게 아래 콘솔 에러의 원인이었고, 되돌렸다. 상세는 아래 「버그 수정」 항목 참조
  - 트레이드오프 — 로딩 중 히어로가 텍스트가 아니라 바로 보인다. 배경·크기·여백이 같아 전환은 부드럽다
- [x] 카드 개수는 **8개**로 잡았다 — 4열 기준 두 줄이라 첫 화면은 채우면서 `PAGE_SIZE`(12)만큼 길게 늘어지지 않는다.
  12개로 깔면 실제 글이 적을 때 스켈레톤이 훨씬 길었다가 접히는 역효과가 난다
- [x] `src/app/community/philosophia/loading.tsx` · `[id]/loading.tsx` 신규 — 위 컴포넌트를 연결만 한다
- [x] `npm run build` 통과 / `npx eslint` — 기존 `no-img-element` 2건 외 새 문제 없음
- [x] 런타임 — 목록 요청의 **스트리밍 응답에 스켈레톤(`animate-pulse`)이 실제로 포함된 뒤 최종 콘텐츠가 도착**하는 것 확인.
  등록·수정·상세 라우트도 회귀 없음
- [x] **전환 순간의 시각적 흔들림 없음 확인** (2026-08-29, 8단계 (10)). 스로틀링으로 다크 스켈레톤 노출까지 확인했다
- [x] **[버그 수정] 콘솔 에러 — `cleaning up async info that was not on the parent Suspense boundary`** (2026-08-29)
  - 증상: 철학시가 진입 시에만 Next.js dev 오버레이에 뜸. 스택 50프레임이 전부 React DevTools 확장
    (`chrome-extension://fmkadmapgofadopljbjfkapdkoienihi/build/installHook.js`)의 `updateFiberRecursively` 등
  - **원인(확정) — 폴백과 실제 페이지가 같은 컴포넌트(`PhilosophiaHero`)를 같은 트리 위치에 렌더한 것.**
    6단계에서 "전환 시 흔들림을 없애려고" `loading.tsx` 폴백에 실제 히어로를 넣었다.
    그러면 폴백→콘텐츠 전환 때 React가 교체가 아니라 **재조정**을 하고 히어로의 fiber가 Suspense 경계를 가로질러
    살아남는다. `async info that was not on the parent Suspense boundary`는 그 회계가 어긋날 때 나온다
  - **왜 reformed-tv는 멀쩡한가** — 라우트 파일 구성은 같지만 `loading.tsx` 내용물이 다르다.
    reformed-tv 폴백은 공용 `PostGridSkeleton`(순수 `div`)이라 **실제 페이지와 공유하는 컴포넌트가 0개**다.
    철학시가만 폴백↔페이지가 컴포넌트를 공유했다
  - **수정 — 폴백에서 공유 컴포넌트를 전부 제거.** `skeletons.tsx` import 0건,
    히어로 자리는 `HeroShell`로 직접 그린다. 로딩 중 히어로는 텍스트 대신 바로 보인다(의도된 트레이드오프)
  - **틀린 1차 진단을 남겨둔다** — 처음엔 스택이 전부 React DevTools 확장 프레임이라 **확장 자체 버그로 판단**했고,
    이어 폴백 안의 `next-view-transitions` `<Link>`가 원인이라 보고 `linkless` prop을 넣었다. **둘 다 틀렸다.**
    링크를 빼도 컴포넌트 공유가 남아 있어 에러가 그대로였다. `linkless`는 되돌렸다
  - 조사 절차 — 클린 브라우저(확장 미설치)로 재현 시도 → 직접 진입·클라이언트 사이드 이동·reformed-tv 대조군
    모두 에러 0건. 헤드리스에는 확장이 붙지 않아 **끝내 이쪽에서 재현하지 못했고**, 매 단계 사용자 확인에 의존했다.
    확장이 필요한 버그는 이 방식으로 검증할 수 없다는 점을 기록해둔다
  - 검증 — 빌드·lint 통과, 폴백 import 0건 확인, 런타임에서 폴백 렌더 후 실제 콘텐츠 도착 확인,
    **사용자가 DevTools 켠 상태에서 에러 사라진 것 확인 (2026-08-29)**

### 7단계 — SEO · 사이트 등록 — [완료] 2026-08-28
- [x] `src/app/sitemap.ts` — `BOARD_PATH_MAP`에 `'philosophia': '/community/philosophia'` 추가.
  이걸로 **게시글 상세 URL이 자동 포함**된다(현재 글이 0건이라 아직 안 나온다. 글 등록 후 재확인 필요)
- [x] `src/app/sitemap.ts` — `STATIC_ROUTES`에 `/community/philosophia` 추가 (`weekly` / `0.7`, reformed-tv와 동일)
  - 두 곳 모두 **reformed-tv 바로 다음 줄**에 배치 — GNB 메뉴 순서와 파일 내 순서를 맞춰 다음 사람이 찾기 쉽게
- [x] `public/llms.txt` — `## 커뮤니티` 섹션 ReformedTV 다음 줄에 추가
- [x] `Header.tsx` GNB 메뉴 — **1차에서 이미 완료**(커뮤니티 서브메뉴, ReformedTV 다음). 2차 작업 아님
- [x] **공개 게시판임을 확인** — `src/app/community/` 하위에 접근 제한 `layout.tsx`가 없다.
  `/resources/*`·`/report/minutes`처럼 제외해야 할 대상이 아니다 (CLAUDE.md SEO 가이드 기준 충족)
- [x] **`/new`·`/edit`은 별도 조치 불필요** — `robots.ts`에 이미 `Disallow: /*/new$`, `Disallow: /*/edit$`
  와일드카드가 있어 철학시가 폼 경로도 자동으로 크롤링에서 빠진다
- [x] `npm run build` 통과 / `npx eslint src/app/sitemap.ts` 깨끗함
- [x] 런타임 — `/sitemap.xml`(200)에 `/community/philosophia` 포함 확인, `/llms.txt`(200)에 해당 줄 확인
- **미검증** — `BOARD_PATH_MAP`을 통한 **게시글 상세 URL 자동 포함**은 글이 있어야 확인된다. 8단계로 이월

### 8단계 — 검증

**자동 검증 — [완료] 2026-08-28**
- [x] `npm run build` 통과. 4개 라우트 생성(`/philosophia`, `/[id]`, `/[id]/edit`, `/new`)
- [x] `npm test` — **9개 통과** (기존 `image-urls.test.ts`. 이번 작업이 회귀를 내지 않았다)
- [x] `npx eslint` — 철학시가 13개 파일 + `sitemap.ts` 검사.
  `no-img-element` 경고 2건뿐이며 **`reformed-tv/page.tsx`·`ReformedTVForm.tsx`도 동일한 경고를 안고 있다**
  (없애려면 `next.config.ts`의 `remotePatterns`에 `img.youtube.com` 추가 필요 — 전 사이트 공용 설정이라 별도 판단 사항)
- [x] **라우트 대칭 검사** — `reformed-tv`와 `philosophia`의 `app/` 하위 파일 구성이 `diff` 결과 **완전 일치**
- [x] 비로그인 접근 — 목록·상세 열람 가능, `[영상 등록]` 미노출, `/new`·`/[id]/edit`은 로그인 리다이렉트(폼 유출 0건)
- [x] board 격리 — reformed-tv 글 id를 philosophia 경로로 요청 시 not-found, 상세 마크업 유출 0건
- [x] `/sitemap.xml`·`/llms.txt`에 목록 URL 반영

**수동 검증 — 로그인이 필요해 사용자가 직접 수행한다. `npm run dev` 후 진행**
- [x] (1) 등록 — `/community/philosophia/new`에서 유튜브 URL·제목·카테고리 입력 후 등록 → **상세로 이동** 확인 (2026-08-29)
  - [x] 잘못된 URL(`https://example.com`) 입력 시 `올바른 유튜브 URL을 입력해주세요.` 노출 — 정상 동작 확인 (2026-08-29)
  - [x] URL 입력 시 **썸네일 미리보기** 노출 — 정상
  - [x] **존재하지 않는 영상 ID 차단** — 아래 「죽은 영상 검증」 항목 참조

- [x] **[기능 추가] 죽은 유튜브 영상 검증 (A안)** — 2026-08-29, 사용자 요청으로 **reformed-tv까지 함께 적용**
  - 발단: "`https://example.com` 입력 시 문구가 안 뜨고 썸네일이 회색으로 나온다"는 제보
  - **재현 결과 — `https://example.com`으로는 재현되지 않았다.** 미리보기도 안 뜨고(`img` 0개),
    제출하면 `올바른 유튜브 URL을…` 문구도 정상 노출된다. 즉 제보된 URL 자체는 문제가 없었다
  - **실제 원인 — 형식은 맞지만 실재하지 않는 영상 ID.** 예: `youtube.com/watch?v=zzzzzzzzzzz`
    - 유튜브는 없는 영상에 **404가 아니라 120×90 회색 플레이스홀더 이미지**를 준다(정상 mqdefault는 320×180)
    - `extractYoutubeId`는 **URL 형태만 보고 실재 여부는 확인하지 않으므로** `videoId`가 truthy →
      검증을 통과해 **경고 없이 죽은 영상이 그대로 저장**됐다. 제보의 두 증상이 정확히 이 케이스와 일치한다
  - 수정 — 미리보기 `<img>`의 `onLoad`에서 `naturalWidth <= 120`이면 죽은 영상으로 보고 경고 + 제출 차단.
    `onError`도 같이 처리. URL 입력이 바뀌면 플래그를 리셋한다(`useEffect` 없이 `onChange`에서)
    - **네트워크 요청이 늘지 않는다** — 어차피 로드하는 미리보기 이미지를 재활용한다
    - 임계값은 `<= 120`으로 잡았다. `< 320`이 더 넓게 잡지만 **정상 영상을 막는 오탐이 죽은 영상을 통과시키는 것보다 나쁘다**
    - 한계: 이미지 로드 전에 곧바로 제출하면 통과한다(기존과 동일). 비공개·연령제한 영상은 미검증
  - 검증 — 임시 라우트로 실제 폼을 띄워 확인 후 **라우트는 삭제**했다
    - 죽은 ID(`zzzzzzzzzzz`) — `naturalWidth 120`, 경고 노출, **제출 차단**(URL 유지)
    - 실재 ID(`bFD8o9tAMqA`) — `naturalWidth 320`, 경고 0건, **검증 통과**(저장 시도로 진행)
    - 두 폼의 변경이 대칭인지 대조 확인, 빌드·lint 통과
  - **reformed-tv도 동일한 구멍이 있었다.** 같은 폼 구조라 한 번에 고쳤다
- [x] (2) 목록 — 등록한 글 노출 + **실제 유튜브 썸네일** 렌더 확인, 스크림 위 재생 아이콘도 정상 (2026-08-29)
- [x] (3) 상세 — **compact 히어로** · 플레이어 · 설명 · 공유 레이아웃 확인.
  **`ShareButtons`의 '링크 복사' 버튼 다크 대비도 정상**(`[&_button:last-child]` 하위 선택자 덮어쓰기가 먹었다) (2026-08-29)
- [x] (4) 조회수 — 상세 진입 시 증가 + 목록 반영 확인 (2026-08-29)
- [x] (5) 수정 → 반영, 삭제 → 목록 복귀 확인 (2026-08-29)
- [x] (6) 권한 — 타인 글 수정·삭제 버튼 미노출 / 관리자 계정 노출 확인 (2026-08-29)
- [ ] (7) **13건 이상 등록** 후 — 페이지네이션 2페이지 동작,
  **2페이지 넘버링이 `01`이 아니라 `13`으로 이어지는지**, 카테고리 필터와 `page` 파라미터 조합
- [x] (8) 숏츠(세로 영상) 썸네일이 16:9 카드에서 깨지지 않음 확인 (2026-08-29)
- [x] (9) 긴 제목에서 `line-clamp-2` 정상 동작, 카드 높이 균일 확인 (2026-08-29)
- [x] (10) 스켈레톤 — 스로틀링으로 목록·상세 진입 시 **다크 스켈레톤 노출 + 실제 콘텐츠 전환 시 흔들림 없음** 확인 (2026-08-29)
- [x] (11) 다크(목록·상세) ↔ 라이트(등록·수정) 전환 위화감 없음 확인 (2026-08-29)
- [x] (12) `/sitemap.xml`에 **게시글 상세 URL 자동 포함 확인** (2026-08-29).
  등록된 2건의 id가 목록 페이지와 사이트맵에서 **완전히 일치** — `BOARD_PATH_MAP` 정상 동작.
  정적 목록 URL 1건 + 상세 2건 = 3건 노출
- [x] (13) 375 / 768 / 1440px 확인 (2026-08-29)
- [x] (14) **React DevTools를 켠 채로** 철학시가 진입 시 `cleaning up async info…` 콘솔 에러 —
  **사라진 것 확인 (2026-08-29)**. 상세는 6단계 「버그 수정」 항목 참조

### 파일 요약
- **1단계(선행·독립 커밋)** — 이동 1개 `features/reformed-tv/YoutubePlayer.tsx` → `features/youtube/`,
  그에 따른 수정 2개 `app/community/reformed-tv/[id]/page.tsx` · `app/community/open-lecture/[id]/page.tsx`
- 신규 9개 — `features/philosophia/`에 `actions.ts` · `PhilosophiaForm.tsx` · `PhilosophiaActions.tsx` · 다크 스켈레톤,
  `app/community/philosophia/`에 `[id]/page.tsx` · `[id]/edit/page.tsx` · `new/page.tsx` · `loading.tsx` · `[id]/loading.tsx`
- 수정 4개 — `app/community/philosophia/page.tsx`(목업→DB) · `features/philosophia/PhilosophiaHero.tsx`(prop 일반화) ·
  `app/sitemap.ts` · `public/llms.txt`
- 삭제 1개 — `features/philosophia/mock-videos.ts`
- 재사용(수정 없음) — `ViewTracker` · `ShareButtons` · `BackToListLink` · `Pagination` · `ConfirmModal` · `ConfirmDialog` ·
  `PageHeader`(폼에서만) · `getIsAdmin` · `extractYoutubeId` / `getYoutubeThumbnail` ·
  `formatYMD` / `formatDateTimeVerbose` · `articleJsonLd`
- 신규 의존성 없음. **DB 마이그레이션 없음**
- 커밋 분리 — 1단계(YoutubePlayer 이동)와 2~8단계(철학시가 2차)는 **반드시 별도 커밋**.
  1단계는 다른 게시판 2곳을 건드리므로 롤백 단위를 섞지 않는다

---

## [완료] 후속 작업 — 2026-08-29

2차 완료 후 실사용 중 나온 요청·개선. 게시글 데이터는 손대지 않고 전부 코드로 처리했다.

### 목록 카드 조회수 아이콘

- [x] 목록 카드의 조회수 앞에 `Eye` 아이콘 추가 (`size={13}` — 상세 페이지와 동일)
- **날짜에는 달력 아이콘을 넣지 않았다.** 상세에는 `Calendar`가 있지만 목록은 뺐다 —
  `128` 같은 숫자는 아이콘이 없으면 무슨 값인지 모르지만, `2026.08.21`은 그 자체로 날짜라
  아이콘이 정보를 더하지 않고 좁은 카드에 잉크만 늘린다

### SEO — description 중복 해소 + JSON-LD keywords

**발단** — 본문에 해시태그를 넣어둔 것을 SEO에 활용할 수 있는지 검토 요청.
검토 중 해시태그보다 훨씬 급한 문제가 실측으로 드러났다.

- **문제 — 게시글 11건의 `description`이 앞 40자까지 전부 동일했다.**
  `generateMetadata`가 본문 앞 120자를 그대로 잘랐는데, 모든 글이 같은 소개문
  (`우리나라에서 최초로 철학시가(Philosong)라는…`)으로 시작한다. 남은 글자는 `CREDITS Lyrics: … SUNO AI`가
  채워서 **정작 시 내용은 한 글자도 안 들어갔다.** 중복 콘텐츠 신호 + 무의미한 검색 스니펫
- 본문 구조 (실측) — `소개문` → `SONG TITLE` → `CREDITS` → `해시태그 9개` → `🎵 가사`(자동 자막)
  - 11건 중 **자막 있는 8건(594~776자) / 자막 없는 3건(196~200자)**.
    자막 없는 글은 해시태그 뒤가 완전히 비어 있어 소개문을 걷어내면 남는 내용이 없다
- **수정** — `features/philosophia/content-meta.ts` 신규
  - `philosophiaDescription()` — **3단계 폴백**으로 그 글에만 있는 내용을 찾는다
    1. `🎵 가사`가 있으면 그 이후 — 자막을 넣던 기존 글 8건
    2. 없으면 **공통 문단이 아닌 첫 문단** — 가사 대신 시 해설을 쓰는 새 형식
    3. 둘 다 없으면 `{제목} — 최더함의 철학시가. …` — 본문이 공통 문구뿐인 기존 3건
  - 어느 경로든 자막 마커(`[음악]` `[노래]` `>>`)와 해시태그를 제거하고
    `truncateAtSentence`(기존 유틸 재사용)로 120자에서 문장 경계로 자른다
  - **소개문을 "찾아서 지우는" 방식은 쓰지 않았다.** 문구가 바뀌면 깨진다.
    대신 `BOILERPLATE` 목록으로 **공통 문단을 건너뛰기만** 하고, 못 찾으면 안전하게 폴백한다.
    덕분에 소개문을 맨 위에 두든 맨 아래에 두든 결과가 같다
  - `philosophiaKeywords()` — 본문 `#태그`를 파싱해 `#`를 떼고 중복 제거
- `lib/json-ld.ts`의 `articleJsonLd`에 `keywords?: string[]` 추가.
  **17개 동적 라우트가 공유하는 파일이라** 선택 파라미터로 두고 **값이 없으면 필드 자체를 넣지 않는다**
- **게시글 본문은 그대로 뒀다** — 검색으로 개별 글에 바로 들어온 사람에게 소개문이 필요하고,
  SEO 목적은 description만 고유해지면 달성된다. 실제 게시물 11건을 고치는 건 되돌리기 어렵다
- 검증
  - **11건 description 전부 고유 확인** (이전: 앞 40자 기준 11건 중복 → 이후: 전부 1건)
  - 자막 마커 제거 확인, 자막 없는 3건은 폴백 정상 동작
  - JSON-LD `keywords` 9개 출력 확인, `og:description`도 함께 갱신됨
  - **reformed-tv 상세에 `keywords` 0건** — 공용 헬퍼 변경이 다른 게시판에 영향 없음을 실제 조회로 확인
  - **`content-meta.test.ts` 단위 테스트 10건 추가** (전체 19건 통과).
    순수 함수라 새 형식 글을 실제로 등록하지 않고도 검증된다. CLAUDE.md의 "유틸 함수 단위 테스트만" 방침과 맞다
  - 빌드·lint 통과

### 앞으로 글 쓸 때의 설명란 형식 (2026-08-29 확정)

**가사를 넣지 않기로 했다**(자동 자막의 오인식 때문). 그러면 `🎵 가사` 표식이 없어 폴백으로만 떨어지므로,
위 2번 경로가 동작하도록 **본문 맨 위에 그 시만의 해설 2~4문장**을 쓴다.

```
바다 앞에서 상처를 내려놓는 마음을 담았습니다.        ← ① 여기가 검색 스니펫이 된다
제주 바다는 그걸 말없이 씻어주는 자리였습니다.

SONG TITLE: 제주도에서

CREDITS
Lyrics: 최더함 / Music: Created with SUNO AI / Video & Editing: 최희진

우리나라에서 최초로 철학시가(Philosong)라는 …          ← ② 공통 소개문은 아래로
                                                        (지우지 않는다 — 읽는 사람에겐 필요하다)
#최더함 #철학시가 … #제주도 #바다 #위로               ← ③ 그 시만의 태그 1~3개 추가
```

- ①이 없으면 description이 `{제목} — 최더함의 철학시가…` 폴백이라 **시 내용이 검색에 전혀 안 드러난다**
- ②를 위에 둬도 코드가 건너뛰지만, 아래로 내리는 편이 읽는 흐름에도 낫다
- ③이 없으면 11건이 전부 같은 태그라 `keywords`에 변별력이 없다
- 가능하면 **시 원문 전문 또는 첫 연 3~4행**을 ①에 넣는 것이 가장 좋다.
  자막과 달리 오타가 없고, 페이지 내용이 충실해져 thin content 문제도 함께 해결된다

### 남은 선택 사항 (사용자 몫 · 안 해도 동작에 문제 없음)

- **자막 없는 3건(`참 다행입니다` · `제발 다시` · `누군들`)에 원본 가사 채우기** —
  지금은 제목 기반 폴백이라 스니펫이 소개문 수준이다. 본문이 198자뿐이라 **페이지 자체의 내용도 빈약하다**.
  가사를 넣으면 코드가 자동으로 더 좋은 description을 뽑는다
- **글별 고유 태그 1~3개 추가** — 현재 11건 전부 동일한 9개 태그
  (`#최더함 #철학시가 #Philosong #귀로듣는시 #감성노래 #힐링음악 #인생철학 #좋은글 #시와음악`)라
  keywords로 승격해도 글 간 변별력이 없다. 공통 태그는 두고 `#제주도 #바다` 같은 걸 덧붙이면 된다
- 참고 — **`<meta name="keywords">`는 구글이 랭킹에 쓰지 않는다**(2009년 공식 발표). 그래서 추가하지 않았다.
  해시태그의 실질 이득은 **태그를 링크로 만들어 내부 링크 구조를 만들 때** 나오는데,
  태그 파싱·필터 페이지·사이트맵까지 필요해 이번 범위에서 제외했다
