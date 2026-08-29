# CLAUDE.md

## 프로젝트 개요

게시판 서비스. 게시글 읽기/쓰기, 유튜브 링크 첨부, 특정 게시물 링크를 카카오톡으로 공유하는 기능을 제공한다.
UI는 모바일 우선 반응형 웹으로 제작한다.
팀 규모: 1인 개발.

---

## 관련 문서
 
작업 전에 아래 문서를 반드시 확인하세요.
 
- 코딩 규칙 및 금지 사항: `docs/coding-guidelines.md`
- 작업 결정 기록: `docs/context-notes.md`
- 작업 목록 및 미해결 이슈: `docs/todo.md`
- 기능별 상세 작업 기록: `docs/features/` — `todo.md`에서 분량이 커진 항목을 기능 단위로 분리해 둔다.
  해당 기능을 손대기 전에 반드시 확인할 것 (예: `docs/features/philosophia.md`)
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
│   ├── posts/         # 게시글 CRUD (에디터·첨부·이미지·조회수 등 공용)
│   ├── youtube/       # 유튜브 URL 파싱, 지연 로드 플레이어 (영상 게시판 공용)
│   ├── books/         # 리폼드북스 — 목차·본문 구획(sections)
│   ├── gallery/       # 행사앨범 — 이미지 뷰어
│   ├── open-lecture/  # 마스터스 오픈강좌 — 일정·장소·기사 링크
│   ├── philosophia/   # 최더함의 철학시가 — 다크 톤 전용 UI
│   └── reformed-tv/   # ReformedTV
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

스키마 원본은 **`src/types/supabase.ts`**(자동 생성)다. 컬럼을 바꾸면 `npm run db:types`로 재생성할 것.
컬럼을 추가한 실제 DDL은 `docs/context-notes.md`에 남아 있다.

### profiles
| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid | auth.users.id 참조 (PK) |
| nickname | text | 표시 이름 |
| is_admin | boolean | 관리자. 모든 게시글 수정/삭제 가능 (`lib/admin.ts`의 `getIsAdmin`) |
| is_masters | boolean | masters 계정 구분 |
| created_at | timestamptz | |

### posts

**모든 게시판이 이 테이블 하나를 공유한다.** `board`로 게시판을, `category`로 게시판 안의 분류를 구분한다.
둘 다 자유 문자열이라 **게시판을 추가할 때 마이그레이션이 필요 없다.**

| 컬럼 | 타입 | 설명 |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | profiles.id 참조 |
| board | text | 게시판 구분 (예: `free`, `notice`, `reformed-tv`, `philosophia`) |
| category | text | 게시판 내 분류 (예: `공지` / `일반` / `숏츠`) |
| title | text | 제목 |
| content | text | 본문 (nullable) |
| views | integer | 조회수 — `ViewTracker` → `incrementViews`로 증가 |
| youtube_url | text | 유튜브 링크 (nullable) |
| thumbnail_url | text | 대표 이미지 (nullable) |
| article_url | text | 외부 기사 링크 (nullable) — 오픈강좌 |
| event_date | date | 행사 일자 (nullable) — 오픈강좌 |
| event_time | time | 행사 시각 (nullable) — 오픈강좌 |
| location | text | 장소 (nullable) — 오픈강좌 |
| sections | jsonb | 구획 본문 (nullable) — 리폼드북스 목차 |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### 그 밖의 테이블
- `press_articles` — RSS로 수집한 외부 언론 기사
- `post_images` · `post_attachments` · `post_videos` — 게시글 첨부 (이미지 / 파일 / 영상)

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
- **JSON-LD (Article)**: 게시글 작성 시 자동 적용 (17개 동적 라우트에 구현됨), 작성자 닉네임을 `author`(Person)로 포함 — 없으면 Organization으로 fallback
- **JSON-LD (Organization·WebSite)**: `src/app/layout.tsx`에서 전역 적용
- **JSON-LD (BreadcrumbList)**: about/vision/constitution 핵심 정적 페이지(confession 제외)에 적용

### 새 페이지/게시판 추가 시에만 수동 작업 필요
1. **새 정적 페이지** (`page.tsx` 신규 생성) → 파일 상단에 `export const metadata: Metadata = { title, description, openGraph }` 추가
2. **새 게시판 추가** → `src/app/sitemap.ts`의 `BOARD_PATH_MAP`과 `STATIC_ROUTES` 목록에 경로 추가
   - **단, 비로그인 접근 불가 페이지(layout.tsx에서 redirect 처리)는 사이트맵에 추가하지 않는다**
   - `public/llms.txt`에도 해당 섹션 링크 추가 (접근 제한 페이지는 사이트맵과 동일하게 제외)
3. **새 동적 라우트** (`[id]/page.tsx` 신규 생성) → `generateMetadata` + `articleJsonLd` 추가 (`src/lib/json-ld.ts`의 헬퍼 사용)
4. **새 핵심 정적 페이지(about/vision/constitution류)** → `src/lib/json-ld.ts`의 `breadcrumbJsonLd()`로 BreadcrumbList 적용 (페이지의 `breadcrumbs={[...]}` 리터럴을 변수로 추출해 `PageHeader`와 JSON-LD 양쪽에 전달). 페이지가 자체 FAQPage 등 BreadcrumbList를 이미 포함한 JSON-LD 헬퍼(예: `confessionPageJsonLd`)를 쓰고 있다면 중복 추가하지 않음

### AI 크롤러 정책
- `src/app/robots.ts`에 GPTBot, ClaudeBot, PerplexityBot, Google-Extended 등 주요 AI 크롤러를 명시적으로 allow — 학습용/검색용 구분 없이 전부 허용(최대 노출 우선, 2026-06-19 결정)
- `public/llms.txt` — AI 검색·답변 엔진을 위한 사이트 개요 및 핵심 섹션 링크(llmstxt.org 표준 포맷). 게시글 개별 URL은 나열하지 않음(sitemap.xml의 역할)

### 접근 제한으로 사이트맵/llms.txt에서 제외된 경로
- `/resources/*` — `src/app/resources/layout.tsx`에서 특정 이메일(`masters@mareca.kr`, `admin@mareca.kr`)만 허용, 그 외 `/`로 리다이렉트
- `/report/minutes` — `src/app/report/layout.tsx`에서 동일한 이메일 제한
- `/online-admin/*` — 로그인 필요
- 위 경로들의 게시글 상세 URL도 `BOARD_PATH_MAP`에서 제외됨

### 관련 파일
- `src/app/sitemap.ts` — 사이트맵 (정적 + 동적 URL 자동 생성)
- `src/app/robots.ts` — 크롤러 허용/차단 규칙 (AI 크롤러 포함)
- `public/llms.txt` — AI 검색·답변 엔진용 사이트 개요
- `src/app/manifest.ts` — PWA 설정
- `src/lib/json-ld.ts` — JSON-LD 헬퍼 (`organizationJsonLd`, `websiteJsonLd`, `breadcrumbJsonLd`, `articleJsonLd`, `confessionPageJsonLd`)
- `src/app/layout.tsx` — 전역 metadata (OG, Twitter, canonical, 구글/네이버 인증, Organization·WebSite JSON-LD)

---

## TODO (미해결 이슈)

`docs/todo.md`로 분리했다. 작업 목록과 상태는 그쪽에서 관리한다.
