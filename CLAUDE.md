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
