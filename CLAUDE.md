# CLAUDE.md

## 프로젝트 개요

게시판 서비스. 게시글 읽기/쓰기, 유튜브 링크 첨부, 특정 게시물 링크를 카카오톡으로 공유하는 기능을 제공한다.
UI는 모바일 우선 반응형 웹으로 제작한다.
팀 규모: 1인 개발.

---

## 기술 스택

### Frontend
- Framework: Next.js 16 (App Router)
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS + shadcn/ui
- State: Zustand
- Animation: Framer Motion (메가 메뉴 등 UI 전환 애니메이션)
- Slider: Swiper (메인 히어로 슬라이더 — Parallax 효과)
- Testing: Vitest (유틸 함수 단위 테스트만), 컴포넌트/E2E 테스트 없음 (의도적 결정)

### Backend
- Supabase (PostgreSQL + Auth + Storage)
- ORM 없음 — Supabase JS 클라이언트 직접 사용
- API Route 없음 — Server Action 사용

#### 인증 (Auth)
- 로그인 방식: Magic Link (이메일) + 카카오 OAuth + 네이버 OAuth
- 회원가입 화면 없음 — 최초 로그인 시 자동 가입 처리
- 비밀번호 없음

#### 접근 제어 (RLS 정책)
- 게시글 읽기: 비로그인 포함 누구나 허용
- 게시글 쓰기/수정/삭제: 로그인 사용자만 허용
- 본인 게시글만 수정/삭제 가능

---

## DevOps
- 소스 관리: GitHub
- 배포: Vercel (main 브랜치 push 시 자동 배포)
- 환경변수: Vercel Dashboard에서 관리
- 별도 CI/CD 파이프라인 없음
- GitHub Actions: Supabase keep-alive 용도로만 사용 (7일 비활성 시 일시 중지 방지)

---

## 주요 명령어

```bash
npm run dev        # 개발 서버
npm test           # Vitest 단위 테스트
npm run build      # 프로덕션 빌드
npm run db:types   # Supabase DB → TypeScript 타입 자동 생성
```

---

## 프로젝트 구조

```
src/
├── app/               # Next.js App Router (페이지 & 레이아웃)
├── components/        # 공유 UI 컴포넌트
│   ├── ui/            # shadcn/ui 기본 컴포넌트
│   └── shared/        # 프로젝트 공통 컴포넌트
├── features/          # 기능별 모듈
│   ├── auth/          # 로그인, 세션
│   ├── posts/         # 게시글 CRUD
│   └── youtube/       # 유튜브 링크 파싱 및 렌더링
├── lib/               # 유틸리티 (supabase 클라이언트 등)
├── hooks/             # 커스텀 React Hooks
└── types/             # 전역 TypeScript 타입
```

---

## 상태 관리
- 로컬 상태: useState
- 전역 상태: Zustand (UI 상태만 — 모달, 토스트 등)
- 서버 상태: Next.js App Router 캐싱 (React Query/SWR 사용 안 함, 의도적 결정)
- URL 상태: Next.js 라우터 (searchParams)

---

## 코드 컨벤션

### 네이밍
- 컴포넌트 파일: PascalCase (예: `PostCard.tsx`)
- 일반 파일: kebab-case (예: `youtube-utils.ts`)
- 상수: UPPER_SNAKE_CASE

### 컴포넌트
- Named export 사용, default export 지양
- 한 파일당 하나의 주요 export
- 관련 타입은 같은 파일에 정의

### 스타일링
- Tailwind className 조합 시 `cn()` 유틸 사용
- 인라인 스타일 금지

---

## 아키텍처 패턴

### Vertical Slice Architecture
- 기능별로 `features/` 하위에 구성
- 각 기능은 컴포넌트, 훅, Server Action을 함께 관리

### Server vs Client Components
- 기본: Server Component
- 인터랙션 필요 시만 `'use client'` 사용

---

## DB 스키마

### profiles
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid | auth.users.id 참조 (PK) |
| nickname | text | 표시 이름 |
| created_at | timestamptz | |

### posts
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | profiles.id 참조 |
| title | text | 제목 |
| content | text | 본문 |
| youtube_url | text | 유튜브 링크 (nullable) |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### 미구현 (추후 추가 예정)
- comments (게시글 댓글)

---

## Supabase Data API GRANT 정책 (2026년 변경 사항)

2026년 10월 30일부터 기존 프로젝트 포함 전체에 적용. `public` 스키마에 새로 만드는 테이블은 명시적 GRANT 없이는 supabase-js 클라이언트로 접근 불가.

- **기존 테이블**: 영향 없음 (grant 이미 부여됨)
- **새 테이블 추가 시**: 테이블 생성 SQL에 아래 GRANT 구문을 반드시 함께 실행

```sql
grant select on public.새테이블 to anon;
grant select, insert, update, delete on public.새테이블 to authenticated;
grant select, insert, update, delete on public.새테이블 to service_role;
alter table public.새테이블 enable row level security;
```

에러 발생 시 PostgREST가 `42501` 에러와 함께 필요한 GRANT 구문을 안내함.

---

## SEO 운영 가이드

### 자동 처리 (추가 작업 불필요)
- **게시글 상세 페이지**: `generateMetadata`가 DB에서 동적으로 title/description/OG/canonical 생성
- **sitemap.xml**: `src/app/sitemap.ts`가 DB 조회해서 자동 생성 — 새 게시글도 자동 포함
- **JSON-LD (Article)**: 게시글 작성 시 자동 적용 (14개 동적 라우트에 구현됨)
- **JSON-LD (Organization)**: `src/app/layout.tsx`에서 전역 적용

### 새 페이지/게시판 추가 시에만 수동 작업 필요
1. **새 정적 페이지** (`page.tsx` 신규 생성) → 파일 상단에 `export const metadata: Metadata = { title, description, openGraph }` 추가
2. **새 게시판 추가** → `src/app/sitemap.ts`의 `BOARD_PATH_MAP`과 `STATIC_ROUTES` 목록에 경로 추가
3. **새 동적 라우트** (`[id]/page.tsx` 신규 생성) → `generateMetadata` + `articleJsonLd` 추가 (`src/lib/json-ld.ts`의 헬퍼 사용)

### 관련 파일
- `src/app/sitemap.ts` — 사이트맵 (정적 + 동적 URL 자동 생성)
- `src/app/robots.ts` — 크롤러 허용/차단 규칙
- `src/app/manifest.ts` — PWA 설정
- `src/lib/json-ld.ts` — JSON-LD 헬퍼 (`organizationJsonLd`, `articleJsonLd`)
- `src/app/layout.tsx` — 전역 metadata (OG, Twitter, canonical, 구글/네이버 인증, Organization JSON-LD)

---

## TODO (미해결 이슈)
- **[완료] 관리자 권한 — 모든 게시글 수정/삭제**
  - 배경: 현재 게시글 수정/삭제는 작성자 본인만 가능. 관리자는 모든 게시글을 수정/삭제할 수 있어야 함
  - 관리자 계정: 새 계정을 별도 생성 후 관리자로 지정 (기존 masters@mareca.kr 계정 사용 안 함)
  - 로그인 방식: 비밀번호 로그인 (Supabase Email/Password Auth) — 일반 유저와 동일한 로그인 화면
  - 관리자 식별: `profiles` 테이블에 `is_admin boolean` 컬럼 추가, Supabase 대시보드에서 해당 유저 row에 수동으로 `true` 설정
  - 구현 범위:
    - `profiles` 테이블 `is_admin` 컬럼 추가 (기본값 `false`)
    - RLS 정책: 수정/삭제 정책에 `is_admin = true` 예외 추가
    - Server Action(`updatePost`, `deletePost`): `user_id` 일치 조건에 관리자 예외 처리 추가
    - `PostActions.tsx`: 관리자 로그인 시 본인 게시글이 아니어도 수정/삭제 버튼 노출
    - `PostForm.tsx`: '공지' 카테고리 선택 옵션을 관리자만 볼 수 있도록 제한
    - Server Action(`createPost`, `updatePost`): 비관리자가 `category='공지'`로 저장 시 거부 처리

- **[완료] 관련기사 상세 페이지 및 카카오톡 공유 기능**
  - 배경: 카카오 Share SDK는 `link`에 앱에 등록된 도메인만 허용하므로, 외부 기사 URL을 카카오 공유 링크로 직접 사용 불가. 현재 관련기사 목록에서 카카오 공유 버튼을 제거하고 링크 복사만 제공 중
  - 해결 방향: 관련기사 상세 페이지(`/news/press/[id]`)를 만들어 마레카 도메인 URL로 카카오 공유 → 상세 페이지 내에서 원문 기사로 이동하도록 유도
  - 상세 페이지 구성:
    - og_title, og_image, og_description 표시
    - "원문 기사 보기" 외부 링크 버튼
    - 카카오톡 공유 버튼 (link를 `/news/press/[id]` 마레카 URL로 설정)
  - DB: `press_articles` 테이블의 `id`를 라우트 파라미터로 사용 (별도 DB 변경 불필요)
  - 관련 파일: `src/app/news/press/[id]/page.tsx` 신규 생성, `src/app/news/press/page.tsx`의 카드 클릭 → 외부 URL 대신 `/news/press/[id]`로 변경

- **[미착수] 로고 기반 브랜드 컬러 시스템 전면 적용**
  - 배경: 현재 프로젝트는 Tailwind 기본 `sky-600/700`, `slate-800` 계열을 Primary 컬러로 사용 중. 로고(public/images/logo.png)의 색상과 괴리가 있어 브랜드 일관성이 부족함
  - 로고 추출 컬러: 네이비 `#1C2E50` / 포레스트 그린 `#2A5728` / 골드 `#C8A224` / 크림 `#EEE8D5`
  - 작업 계획 (5단계):
    1. `tailwind.config.ts`에 `brand-navy`, `brand-green`, `brand-gold`, `brand-cream` 커스텀 토큰 정의
    2. `Header.tsx`, `Footer.tsx`, `PageHeader.tsx` — `slate-800` → `brand-navy`, 활성 메뉴 → `brand-gold`
    3. 전체 파일 `sky-600/700/300` → `brand-green` 일괄 교체 (버튼, focus ring, 링크 호버 등)
    4. `brand-gold` 포인트 컬러 선별 적용 (활성 카테고리, NEW 뱃지 등)
    5. 전체 화면 검토 및 미세 조정
  - 예상 수정 파일: 약 20~25개 / 예상 소요 시간: 약 1시간

- **[완료] 언론기사 RSS 피드 수집 게시판**
  - 개요: 특정 기독교 언론사의 RSS 피드를 주기적으로 수집해 게시판 형태로 노출, 클릭 시 원문 기사로 이동
  - 수집 대상 언론사:
    - 기독일보: `http://christiandaily.co.kr/rss`
    - 크리스천투데이: `https://www.christiantoday.co.kr/rss`
  - 구현 방식: GitHub Actions 스케줄러(cron) → RSS XML 파싱 → Supabase `press_articles` 테이블 저장 → Server Component로 렌더링
  - DB 스키마 (예정):
    - `id` uuid PK, `url` text, `og_title` text, `og_image` text, `og_description` text, `source_name` text, `published_at` date, `created_at` timestamptz
  - 표시 정책: 제목 + 요약 + 링크만 노출 (기사 원문 복사 금지 — 저작권)
  - 관련 파일 위치 예정: `src/features/press/`, `src/app/news/press/page.tsx`

- **[완료] 후원하기 페이지**
  - 개요: 후원 신청 폼을 입력받아 Supabase에 저장, 관리자가 확인 후 계좌이체로 수동 처리하는 방식 (온라인 즉시결제 없음)
  - 구현 흐름: 사용자 폼 입력 → 제출 → Supabase `donations` 테이블 저장 → 관리자 확인 후 계좌 안내
  - 폼 필드: 성명, 성별, 연락처, 이메일, 주소(카카오 주소 API), 교단명, 교회명, 교직, 회원구분(개인/단체/교회), 후원액(매월), 후원 은행
  - DB 스키마 (예정): `id` uuid, `name` text, `gender` text, `phone` text, `email` text, `address` text, `church_name` text, `denomination` text, `position` text, `member_type` text, `amount` integer, `bank` text, `agreed_privacy` boolean, `created_at` timestamptz
  - 추가 고려사항:
    - 하단 개인정보 수집·이용 동의 체크박스 필수
    - 비로그인 제출 허용 시 스팸 방지 처리 필요
    - 관리자 알림: Supabase 대시보드 확인 또는 이메일 알림(Resend) 추가 가능
  - 관련 파일 위치 예정: `src/app/donate/page.tsx`, `src/features/donate/`
  - 기획 의도가 바뀌어서 푸터에 후원 계좌번호 노출하는것으로 변경

- **[미착수] 웹 성능 개선 (Core Web Vitals)**
  - 배경: Vercel Speed Insights 기준 FCP 2.06s, CLS 0.14, TTFB 1.54s — 세 항목 모두 개선 여지 있음
  - 개선 항목 (임팩트 순):
    1. **TTFB (1.54s)**: Supabase 쿼리가 많은 Server Component에 Next.js `revalidate` 또는 `cache` 적용 — 자주 바뀌지 않는 데이터(임원 목록, 게시판 목록 등) 우선
    2. **FCP (2.06s)**: TTFB 개선 시 자동 개선 기대 / 추가로 외부 폰트 preload 설정 확인
    3. **CLS (0.14)**: 이미지 `width`/`height` 미지정 요소 확인 및 Next.js `<Image>` 컴포넌트 적용, 폰트 로드 전후 레이아웃 밀림 제거
  - 수정 난이도: CLS < FCP < TTFB

- **[완료 - Service Worker 작업으로 대체] 스마트폰 홈 화면 바로가기 아이콘 추가 기능 (PWA)**
  - 개요: 메인 페이지에 "홈 화면에 추가" 버튼을 두고 클릭 시 스마트폰 바탕화면에 마레카 아이콘 바로가기 생성
  - 플랫폼별 동작:
    - Android (Chrome): `beforeinstallprompt` 이벤트 가로채기 → 버튼 클릭 시 시스템 설치 다이얼로그 표시
    - iOS (Safari): 자동화 불가 → "공유 → 홈 화면에 추가" 단계 안내 모달 표시
  - 선행 작업 (PWA 기반 설정):
    - `src/app/manifest.ts` 신규 생성 (앱 이름, 아이콘, 시작 URL 등)
    - `public/icons/` 아이콘 파일 배치 (192×192, 512×512, apple-touch-icon 180×180)
    - `src/app/layout.tsx` metadata에 viewport, themeColor, appleWebApp 추가
  - 신규 컴포넌트: `src/components/shared/AddToHomeScreen.tsx`
  - 이미 설치됐거나 standalone 모드면 버튼 자동 숨김 처리 필요

- **[완료] 게시글 에디터 기능 추가**
  - 대상 파일: `src/features/posts/PostEditor.tsx`
  - 추가할 기능:
    - 밑줄 (Underline) — StarterKit 미포함, `@tiptap/extension-underline` 설치 필요
    - 취소선 (Strike) — StarterKit에 포함, 버튼만 추가
    - 텍스트 색상 (Color) — `@tiptap/extension-color` + `@tiptap/extension-text-style` 설치 필요, 컬러 피커 UI 추가
    - 하이라이트 (Highlight) — `@tiptap/extension-highlight` 설치 필요
    - 링크 삽입/제거 (Link) — 익스텐션은 이미 등록됨, URL 입력 모달 UI 추가 필요
    - 인용구 (Blockquote) — StarterKit에 포함, 버튼만 추가

- **[완료] 게시판 추가 — 2묶음: 총회 공식 문서**
  - 선행 작업 완료: `actions.ts`, `PostForm.tsx`, `PostActions.tsx` board/boardPath 범용화 완료 (1묶음 작업 시)
  - 총회의사록: `board='minutes'`, 경로 `/report/minutes` — 기존 `src/app/report/minutes/page.tsx` ComingSoon → 게시판으로 교체, `[id]`, `new`, `[id]/edit` 신규 생성
  - 교회계획: `board='church-plan'`, 경로 `/online-admin/plan` — 기존 `src/app/online-admin/plan/page.tsx` ComingSoon → 게시판으로 교체, `[id]`, `new`, `[id]/edit` 신규 생성
  - 카테고리: `공지`, `일반` (단순)

- **[완료] 게시판 추가 — 3묶음: 소식/커뮤니티**
  - 선행 작업 완료: `actions.ts`, `PostForm.tsx`, `PostActions.tsx` board/boardPath 범용화 완료 (1묶음 작업 시)
  - 공지사항: `board='notice'`, 경로 `/news/notice` — 기존 `src/app/news/notice/page.tsx` ComingSoon → 게시판으로 교체
  - 마스터스 메시지: `board='message'`, 경로 `/community/message` — 기존 `src/app/community/message/page.tsx` ComingSoon → 게시판으로 교체
  - Plus Voice: `board='voice'`, 경로 `/community/voice` — 기존 `src/app/community/voice/page.tsx` ComingSoon → 게시판으로 교체
  - 카테고리: `공지`, `일반` (단순)

- **[미해결] 404/500 페이지에서 "이전 페이지" 버튼(BackButton) 클릭 후 GNB 애니메이션·인터랙션 불작동**
  - 증상: 404/500 같은 하드 네비게이션 페이지에서 `router.back()` 또는 `history.back()` 사용 시 이전 페이지로 돌아왔을 때 Header의 Framer Motion 애니메이션 및 hover 인터랙션이 동작하지 않음
  - "홈으로 가기"(`Link href="/"`) 클릭 시에는 정상 동작
  - 시도한 접근: bfcache `pageshow` 감지, `useEffect` → `useLayoutEffect` 변경, `isNavigatingRef` 네비게이션 가드, `BackButton` popstate+reload — 모두 미해결
  - 관련 파일: `src/components/shared/Header.tsx`, `src/components/shared/BackButton.tsx`, `src/app/not-found.tsx`, `src/app/error.tsx`

---

## 하지 말아야 할 것
- `any` 타입 사용 금지
- `useEffect`로 데이터 페칭 금지 → Server Component 또는 Server Action 사용
- default export 금지 → Named export 사용
- API Route 신규 생성 금지 → Server Action 사용
- Supabase 클라이언트를 컴포넌트 내부에서 직접 생성 금지 → `lib/supabase.ts`에서 import
- 인라인 스타일 금지 → Tailwind 클래스 사용
- `console.log` 커밋 금지
- 요청 범위 밖의 기존 파일 수정 금지 — 지침은 신규 파일 또는 직접 수정 요청된 파일에만 적용

---

## Claude 코드 작성 지침

LLM의 흔한 코딩 실수를 줄이기 위한 행동 지침. Andrej Karpathy의 관찰에서 도출됨.

**트레이드오프:** 이 지침들은 속도보다 신중함을 우선한다. 사소한 작업은 판단해서 적용할 것.

### 1. 코딩 전에 먼저 생각하기

**가정하지 말 것. 혼란을 숨기지 말 것. 트레이드오프를 드러낼 것.**

구현 전에 아래를 확인할 것.

- 가정을 명시적으로 서술한다. 불확실하면 질문한다.
- 여러 해석이 가능하면 제시한다 — 조용히 선택하지 않는다.
- 더 단순한 접근이 있으면 말한다. 필요하면 반론을 제기한다.
- 불분명한 부분이 있으면 멈춘다. 무엇이 혼란스러운지 명시하고 질문한다.

### 2. 단순함 우선

**문제를 해결하는 최소한의 코드. 추측성 코드는 없다.**

- 요청받은 것 이상의 기능은 추가하지 않는다.
- 단일 사용 코드에 추상화하지 않는다.
- 요청하지 않은 "유연성"이나 "설정 가능성"을 추가하지 않는다.
- 불가능한 시나리오에 대한 에러 처리를 하지 않는다.
- 200줄로 작성했는데 50줄로 가능하다면 다시 작성한다.

스스로 물어볼 것. "시니어 엔지니어가 이걸 보고 과하게 복잡하다고 할까?" 그렇다면 단순화한다.

### 3. 외과적 변경

**반드시 필요한 곳만 건드린다. 내가 만든 지저분함만 정리한다.**

기존 코드를 수정할 때.

- 인접한 코드, 주석, 포맷을 "개선"하지 않는다.
- 망가지지 않은 것을 리팩토링하지 않는다.
- 내 스타일과 달라도 기존 스타일을 따른다.
- 관련 없는 dead code를 발견하면 언급은 하되 삭제하지 않는다.

내 변경으로 인해 orphan이 생긴 경우.

- 내 변경으로 인해 사용되지 않게 된 import/변수/함수는 제거한다.
- 기존에 있던 dead code는 요청받지 않으면 건드리지 않는다.

테스트: 변경된 모든 줄은 사용자의 요청으로 직접 추적 가능해야 한다.

### 4. 목표 중심 실행

**성공 기준을 정의한다. 검증될 때까지 반복한다.**

작업을 검증 가능한 목표로 전환할 것.

- "유효성 검사 추가" → "잘못된 입력에 대한 테스트를 작성하고, 통과시킨다"
- "버그 수정" → "버그를 재현하는 테스트를 작성하고, 통과시킨다"
- "X 리팩토링" → "리팩토링 전후 테스트가 통과하는지 확인한다"

여러 단계 작업이라면 간략한 계획을 먼저 서술할 것.

```
1. [단계] → 검증: [확인 방법]
2. [단계] → 검증: [확인 방법]
3. [단계] → 검증: [확인 방법]
```

명확한 성공 기준이 있어야 독립적으로 반복할 수 있다. "작동하게 해줘" 같은 기준은 매번 명확화가 필요하다.

### 5. 한국어 출력 시 문장 끝에 콜론 금지

**한국어 문장은 마침표로 끝낸다. 콜론으로 끝내지 않는다.**

사용자가 한국어로 작성하면 출력도 한국어로 한다.

- 다음 줄이 목록이나 예시여도 문장을 `:`로 끝내지 않는다.
- 영어 문서로 훈련된 LLM은 콜론 습관을 한국어에도 적용한다. 주의할 것.
- 테스트: 한국어 문장 종결어미는 `.`, `?`, `!`이어야 한다 — `:` 가 아니다.
- 코드, key-value 쌍, 레이블 내부의 콜론은 허용된다. 문장 끝에는 금지다.

### 6. 새 파일 상단에 한국어 한 줄 주석

**새 소스 파일을 만들 때 첫 줄에 파일의 역할을 설명하는 한국어 한 줄 주석을 작성한다.**

- TypeScript/JavaScript: `// 사용자 인증 상태를 관리하는 Context Provider`
- Python: `# KIS API 호출을 비동기로 래핑하는 클라이언트`
- SQL: `-- 일별 집계 결과를 저장하는 머티리얼라이즈드 뷰`
- 필수 디렉티브(`'use client'`, `'use server'`, shebang) 바로 아래에 위치시킨다.
- 설정 파일(`*.config.ts`, `package.json` 등)은 생략한다.

이유: 에이전트는 전체 코드베이스가 아닌 파일 단위로 선택적으로 읽는다. 한 줄짜리 한국어 헤더가 있으면 다음 세션(사람이든 에이전트든)이 전체 파일을 다시 읽지 않아도 즉시 맥락을 파악할 수 있다.

### 7. 계획 + 체크리스트 + 컨텍스트 노트

**사소하지 않은 작업이라면 코딩을 시작하기 전에 세 가지 산출물을 먼저 만든다.**

- **계획** — 무엇을 왜 만드는지.
- **체크리스트** (`checklist.md`) — 체크박스 형태의 구체적인 작업 목록. 진행하면서 체크한다.
- **컨텍스트 노트** (`context-notes.md`) — 작업 중 내린 결정과 그 이유. 지속적으로 추가한다.

사용자가 계획만 주고 코딩을 시작하라고 하면, 먼저 물어볼 것. "체크리스트와 컨텍스트 노트를 먼저 만들까요?" 다음 세션 — 내 것이든 다른 누군가의 것이든 — 은 모든 결정을 다시 유도하지 않고 이어받기 위해 노트가 필요하다.

### 8. 완료 표시 전에 테스트 실행

**코드를 건드렸다면, "완료"라고 말하기 전에 테스트를 실행한다.**

- `npm test`, `pytest`, `cargo test` 등 프로젝트에서 사용하는 것을 실행한다.
- 테스트가 통과하면 결과를 보고한다. 실패하면 수정하고 다시 실행한다.
- 테스트 설정이 없다면 최소한 프로젝트가 빌드/컴파일되는지 확인한다.
- "끝", "완료", "다 됐어" 신호를 기다리지 말고 먼저 실행한다.

이 단계는 LLM이 가장 자주 건너뛰는 단계다. 타협 불가로 취급할 것.

### 9. 시맨틱 커밋

**하나의 논리적 변경이 완료되면 커밋한다. 사용자가 요청할 때까지 기다리지 않는다.**

- 테스트: "이 커밋을 한 문장으로 설명할 수 있는가?" 가능하면 커밋한다. 불가능하면 변경이 아직 섞여 있는 것이다 — 분리한다.
- 좋은 예: "auth 미들웨어 추가". 나쁜 예: "auth 추가하고 UI도 고치고 버그도 수정" (3개로 분리할 것).
- 20개의 관련 없는 수정을 쌓아두면 개별 롤백 능력을 잃는다.
- 의미 없이 커밋하지는 않는다 — 의미 있는 단위만.

참고: 혼자 하는 프로토타입이나 일회성 스크립트라면 속도가 느려진다면 느슨하게 그룹핑해도 된다. 요점은 의식이 아니라 되돌릴 수 있는 능력이다.

### 10. 에러는 추측하지 말고 읽을 것

**실제 에러/로그 줄을 읽는다. 기억에서 패턴 매칭하지 않는다.**

무언가 실패했을 때.

- 전체 에러 메시지와 스택 트레이스를 읽는다.
- 예상하는 내용이 아닌 실제 로그 출력을 확인한다.
- 원인을 확인하기 전에 "흔한 수정법"을 적용하지 않는다.
- 불분명하면 print/log를 추가해서 상태를 확인한 후 수정한다.

이 단계는 "테스트 실행" 다음으로 LLM이 가장 자주 건너뛰는 단계다. 에러 키워드로 추측하고 가장 최근에 봤던 패턴 수정법을 적용한다. 그렇게 한 줄짜리 버그가 세 파일 리팩토링이 된다.

---

**이 지침들이 제대로 작동하고 있다면:** diff에 불필요한 변경이 줄고, 과도한 복잡함으로 인한 재작성이 줄고, 실수 후가 아닌 구현 전에 명확화 질문이 나온다.
