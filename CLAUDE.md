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
- SEO 최적화

---

## TODO (미해결 이슈)

- **[미구현] 최초 로그인 시 닉네임 수집 기능**
  - 배경: 이메일 OTP 로그인 성공 후 닉네임이 없는 사용자를 닉네임 입력 화면으로 안내하는 기능을 구현하다가, OTP 시간당 2회 제한으로 테스트가 어려워 일시 제거
  - 현재 상태: 로그인 성공 시 무조건 홈(`/`)으로 이동, 닉네임 없으면 이메일 주소가 그대로 표시됨
  - 준비된 코드: `src/features/auth/actions.ts`에 `checkNeedsNickname()`, `saveNickname()` Server Action 이미 구현됨
  - 재구현 시 참고: `src/app/auth/callback/route.ts`에 닉네임 체크 후 `/login?setup=nickname` 리다이렉트 코드가 남아 있으나 현재 로그인 페이지가 로그인 상태이면 홈으로 보내므로 실질적으로 동작하지 않음 — 함께 정리 필요

- **[미착수] 로고 기반 브랜드 컬러 시스템 전면 적용**
  - 배경: 현재 프로젝트는 Tailwind 기본 `sky-600/700`, `slate-800` 계열을 Primary 컬러로 사용 중. 로고(public/images/logo.jpg)의 색상과 괴리가 있어 브랜드 일관성이 부족함
  - 로고 추출 컬러: 네이비 `#1C2E50` / 포레스트 그린 `#2A5728` / 골드 `#C8A224` / 크림 `#EEE8D5`
  - 작업 계획 (5단계):
    1. `tailwind.config.ts`에 `brand-navy`, `brand-green`, `brand-gold`, `brand-cream` 커스텀 토큰 정의
    2. `Header.tsx`, `Footer.tsx`, `PageHeader.tsx` — `slate-800` → `brand-navy`, 활성 메뉴 → `brand-gold`
    3. 전체 파일 `sky-600/700/300` → `brand-green` 일괄 교체 (버튼, focus ring, 링크 호버 등)
    4. `brand-gold` 포인트 컬러 선별 적용 (활성 카테고리, NEW 뱃지 등)
    5. 전체 화면 검토 및 미세 조정
  - 예상 수정 파일: 약 20~25개 / 예상 소요 시간: 약 1시간

- **[미착수] 언론기사 RSS 피드 수집 게시판**
  - 개요: 특정 기독교 언론사의 RSS 피드를 주기적으로 수집해 게시판 형태로 노출, 클릭 시 원문 기사로 이동
  - 수집 대상 언론사:
    - 기독일보: `http://christiandaily.co.kr/rss`
    - 크리스천투데이: `https://www.christiantoday.co.kr/rss`
  - 구현 방식: GitHub Actions 스케줄러(cron) → RSS XML 파싱 → Supabase `press_articles` 테이블 저장 → Server Component로 렌더링
  - DB 스키마 (예정):
    - `id` uuid PK, `url` text, `og_title` text, `og_image` text, `og_description` text, `source_name` text, `published_at` date, `created_at` timestamptz
  - 표시 정책: 제목 + 요약 + 링크만 노출 (기사 원문 복사 금지 — 저작권)
  - 관련 파일 위치 예정: `src/features/press/`, `src/app/news/press/page.tsx`

- **[미착수] 후원하기 페이지**
  - 개요: 후원 신청 폼을 입력받아 Supabase에 저장, 관리자가 확인 후 계좌이체로 수동 처리하는 방식 (온라인 즉시결제 없음)
  - 구현 흐름: 사용자 폼 입력 → 제출 → Supabase `donations` 테이블 저장 → 관리자 확인 후 계좌 안내
  - 폼 필드: 성명, 성별, 연락처, 이메일, 주소(카카오 주소 API), 교단명, 교회명, 교직, 회원구분(개인/단체/교회), 후원액(매월), 후원 은행
  - DB 스키마 (예정): `id` uuid, `name` text, `gender` text, `phone` text, `email` text, `address` text, `church_name` text, `denomination` text, `position` text, `member_type` text, `amount` integer, `bank` text, `agreed_privacy` boolean, `created_at` timestamptz
  - 추가 고려사항:
    - 하단 개인정보 수집·이용 동의 체크박스 필수
    - 비로그인 제출 허용 시 스팸 방지 처리 필요
    - 관리자 알림: Supabase 대시보드 확인 또는 이메일 알림(Resend) 추가 가능
  - 관련 파일 위치 예정: `src/app/donate/page.tsx`, `src/features/donate/`

- **[미착수] 스마트폰 홈 화면 바로가기 아이콘 추가 기능 (PWA)**
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

- **[미착수] 게시글 에디터 기능 추가**
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
