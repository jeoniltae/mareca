# mareca — 마스터스개혁파총회 웹사이트

마스터스개혁파총회 공식 웹사이트입니다. 서비스 주소는 https://mareca.org 입니다.
총회 소개 페이지와 게시판(공지, 소식, 영상, 앨범, 자료실 등)으로 구성되며, 모바일 우선 반응형으로 만들었습니다.

- 게시글 읽기와 쓰기를 지원합니다. 리치 텍스트 에디터, 이미지·파일 첨부, 유튜브·Mux 영상을 쓸 수 있습니다.
- 게시글을 카카오톡으로 공유할 수 있습니다.
- 로그인은 매직 링크(이메일), 카카오, 네이버 중 하나로 합니다. 회원가입 화면은 없고 처음 로그인할 때 자동으로 가입됩니다.
- 외부 언론 기사를 RSS로 자동 수집합니다(GitHub Actions, 6시간 간격).
- PWA로 홈 화면에 설치할 수 있습니다.

## 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router), React, TypeScript (strict) |
| 스타일 | Tailwind CSS, shadcn/ui, Framer Motion, Swiper |
| 에디터 | Tiptap |
| 상태 | Zustand (UI 상태만). 서버 상태는 App Router 캐싱으로 처리 |
| 백엔드 | Supabase (PostgreSQL, Auth, Storage). ORM과 API Route 없이 **Server Action**으로 처리 |
| 영상 | YouTube (지연 로드), Mux |
| 테스트 | Vitest (유틸 함수 단위 테스트만) |
| 배포 | Vercel. `main`에 push하면 자동 배포 |

## 시작하기

Node.js와 npm이 필요합니다.

```bash
npm install
cp .env.example .env.local   # 값을 채운다 (아래 표 참고)
npm run dev                  # http://localhost:3000
```

### 환경변수

`.env.local`에 넣습니다. 운영 환경 값은 Vercel Dashboard에서 관리합니다.

| 변수 | 용도 | 필수 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL | 예 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon 키 | 예 |
| `NEXT_PUBLIC_SITE_URL` | 사이트 절대 주소. canonical, OG, sitemap, JSON-LD에 쓴다 | 예 |
| `NEXT_PUBLIC_KAKAO_JS_KEY` | 카카오톡 공유 (Kakao JavaScript 키) | 공유 기능 사용 시 |
| `MUX_TOKEN_ID` / `MUX_TOKEN_SECRET` | Mux 영상 업로드 (서버 전용) | 클럽소식 영상 사용 시 |
| `SUPABASE_URL` / `SUPABASE_SERVICE_KEY` | RSS 수집 스크립트 (`scripts/rss-sync.js`) | 스크립트 실행 시 |

카카오·네이버 OAuth는 코드가 아니라 Supabase Dashboard의 Auth Providers에서 설정합니다.

> `NEXT_PUBLIC_`이 붙지 않은 키는 클라이언트 번들에 들어가면 안 됩니다. 서비스 키는 Server Action이나 스크립트에서만 쓰세요.

## 명령어

```bash
npm run dev        # 개발 서버
npm run build      # 프로덕션 빌드 (webpack)
npm start          # 빌드 결과 실행
npx vitest run     # 단위 테스트 1회 실행 (npm test는 watch 모드)
npm run lint       # ESLint
npx tsc --noEmit   # 타입 체크
npm run db:types   # Supabase 스키마 → src/types/supabase.ts 재생성
```

### 개발 환경에서 알아둘 것 (Windows)

- **vitest는 드라이브 문자를 대문자 `C:`로 연 경로에서 실행해야 합니다.** 소문자 `c:` 경로(VS Code 터미널 기본값일 수 있음)에서 실행하면 모든 테스트 파일이 `Cannot read properties of undefined (reading 'config')`로 실패합니다.
- `next dev`(Turbopack)가 메모리 부족으로 종료되면 `npx next dev --webpack`으로 실행하세요.
- 개발 서버를 켜 둔 채 `npm run build`를 실행하면 같은 `.next` 폴더를 덮어써서 개발 서버가 500을 냅니다. 빌드하기 전에 개발 서버를 끄세요.
- `npm start`로 한 번이라도 띄우면 서비스 워커가 등록됩니다. 그 뒤에는 `npm run dev`에서도 서비스 워커가 오래된 캐시를 보여 줄 수 있습니다(`docs/todo.md` "PWA 개발 시 서비스 워커 stale 캐시 주의").

## 프로젝트 구조

```
src/
├── app/             # 페이지·레이아웃 (App Router), sitemap·robots·manifest
├── components/
│   ├── ui/          # shadcn/ui 기본 컴포넌트
│   └── shared/      # 공통 컴포넌트 (PageHeader, ShareButtons 등)
├── features/        # 기능별 모듈 — 컴포넌트·Server Action·유틸을 함께 둔다
│   ├── auth/  posts/  youtube/  books/  gallery/
│   └── open-lecture/  philosophia/  reformed-tv/
├── lib/             # Supabase 클라이언트, JSON-LD, 텍스트·해시태그 유틸
├── hooks/
└── types/           # supabase.ts (자동 생성) 등
scripts/             # RSS 수집, 과거 기사 크롤링, iOS 스플래시 생성
docs/                # 작업 문서 (아래 참고)
```

### 데이터 모델

**모든 게시판이 `posts` 테이블 하나를 함께 씁니다.**
- `board` 컬럼으로 게시판을 구분합니다. 예: `notice`, `free`, `reformed-tv`, `philosophia`
- `category` 컬럼으로 게시판 안의 분류를 구분합니다. 예: `일반`, `숏츠`
- 두 값 모두 자유 문자열이라 게시판을 추가해도 DB 마이그레이션이 필요 없습니다.

전체 스키마의 원본은 `src/types/supabase.ts`입니다. 컬럼을 바꾼 뒤에는 `npm run db:types`로 다시 만드세요.

접근 제어는 Supabase RLS로 합니다.
- 읽기: 누구나 할 수 있습니다.
- 쓰기: 로그인한 사용자만 할 수 있습니다.
- 수정·삭제: 작성자 본인만 할 수 있습니다. 관리자(`profiles.is_admin`)는 모든 글을 수정·삭제할 수 있습니다.

> 새 테이블을 만들 때는 GRANT 구문을 함께 실행해야 supabase-js로 접근할 수 있습니다(2026-10-30부터 적용된 Supabase 정책). 구문은 `CLAUDE.md`에 있습니다.

## 게시판 경로

| board | 경로 |
|---|---|
| `news` · `notice` · `reformed-books` | `/news/all` · `/news/notice` · `/news/books` |
| `message` · `voice` · `free` · `album` | `/community/message` · `/community/voice` · `/community/free` · `/community/album` |
| `reformed-tv` · `philosophia` · `open-lecture` | `/community/reformed-tv` · `/community/philosophia` · `/community/open-lecture` |
| `club-news` | `/club-news/news` |
| (RSS 수집 기사) | `/news/press` |

다음 경로는 접근이 제한되어 sitemap과 `llms.txt`에서 뺐습니다.
- `/resources/*`, `/report/minutes`: 지정된 계정만 볼 수 있습니다.
- `/online-admin/*`: 로그인해야 볼 수 있습니다.

## SEO

- 게시글 상세 페이지는 `generateMetadata`로 메타데이터를 만들고, `src/lib/json-ld.ts`로 JSON-LD를 출력합니다.
  - 모든 상세 페이지: Article
  - 영상 게시판(ReformedTV, 철학시가, 클럽소식): Article과 함께 VideoObject도 출력합니다.
- `src/app/sitemap.ts`가 DB를 조회해 sitemap을 자동으로 만듭니다. `robots.ts`는 AI 크롤러를 허용합니다. `public/llms.txt`는 AI 검색 엔진용 사이트 개요입니다.
- **JSON-LD `<script>`에는 반드시 `toJsonLdHtml(...)`로 직렬화한 값을 넣으세요.** `JSON.stringify`를 직접 쓰면 제목이나 본문의 `</script>`가 태그를 닫아 저장형 XSS가 됩니다.
- 새 게시판이나 페이지를 추가할 때 손으로 해야 하는 작업은 `CLAUDE.md`의 "SEO 운영 가이드"에 정리돼 있습니다.

## 자동화 (GitHub Actions)

| 워크플로 | 주기 | 하는 일 |
|---|---|---|
| `rss-sync.yml` | 6시간마다 | `scripts/rss-sync.js`로 기독일보·크리스천투데이 RSS를 수집해 `press_articles`에 저장 |
| `supabase-keepalive.yml` | 5일마다 | Supabase가 7일 동안 요청이 없어 일시 중지되지 않도록 요청을 보냄 |

Secrets: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 문서

작업 전에 아래 문서를 확인하세요.

| 문서 | 내용 |
|---|---|
| `CLAUDE.md` | 프로젝트 규칙, 스키마, SEO 운영 가이드 |
| `docs/coding-guidelines.md` | 코딩 규칙과 금지 사항 |
| `docs/todo.md` | 작업 목록과 미해결·보류 이슈 |
| `docs/features/` | 분량이 큰 기능의 상세 기록 (예: `philosophia.md`) |
| `docs/plans/` | 기능별 spec, plan, 검증 기록 |

## 코드 규칙 요약

- 컴포넌트는 기본적으로 Server Component로 만들고, 인터랙션이 필요할 때만 `'use client'`를 붙입니다.
- export는 named export만 씁니다(default export 금지).
- 클래스 조합은 `cn()`으로 하고, 인라인 스타일은 쓰지 않습니다.
- 데이터 변경은 Server Action으로 합니다. API Route는 새로 만들지 않습니다.
- 파일 이름은 컴포넌트면 `PascalCase.tsx`, 그 밖의 파일이면 `kebab-case.ts`입니다.
- 새 파일 첫 줄에는 파일의 역할을 한국어 한 줄 주석으로 적습니다.
- 테스트는 유틸 함수 단위 테스트만 작성합니다. 컴포넌트·E2E 테스트는 의도적으로 두지 않습니다.
