# TODO (미해결 이슈)

CLAUDE.md에서 분리한 작업 목록. 상태 표기는 `[미착수]` / `[보류]` / `[완료]`를 쓴다.
완료 항목도 결정 배경이 남아 있어 지우지 않고 보관한다.

관련 문서 — 코딩 규칙: `docs/coding-guidelines.md` / 작업 결정 기록: `docs/context-notes.md`

---

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

- **[완료] 웹 성능 개선 (Core Web Vitals)**
  - 배경: Vercel Speed Insights 기준 FCP 2.06s, CLS 0.14, TTFB 1.54s — 세 항목 모두 개선 여지 있음
  - 개선 항목 (임팩트 순):
    1. **TTFB (1.54s)**: Supabase 쿼리가 많은 Server Component에 Next.js `revalidate` 또는 `cache` 적용 — 자주 바뀌지 않는 데이터(임원 목록, 게시판 목록 등) 우선
    2. **FCP (2.06s)**: TTFB 개선 시 자동 개선 기대 / 추가로 외부 폰트 preload 설정 확인
    3. **CLS (0.14)**: 이미지 `width`/`height` 미지정 요소 확인 및 Next.js `<Image>` 컴포넌트 적용, 폰트 로드 전후 레이아웃 밀림 제거
  - 수정 난이도: CLS < FCP < TTFB

- **[완료] 스마트폰 홈 화면 바로가기 아이콘 추가 기능 (PWA)**
  - 구현 위치: `src/components/shared/AddToHomeScreen.tsx`, `src/app/layout.tsx`에서 렌더
  - **메인 페이지가 아니라 `layout.tsx`에 둔다** — `layout.tsx` 인라인 스크립트가 모든 경로에서
    `beforeinstallprompt`를 `preventDefault`로 선점하므로, 배너가 `/`에만 있으면 공유 링크로
    서브 페이지에 진입한 사용자는 Chrome 기본 설치 UI도 막히고 배너도 못 봐서 설치 경로가 사라진다
  - 플랫폼별 동작:
    - Android/데스크톱 Chrome: `beforeinstallprompt`를 가로채 시스템 설치 다이얼로그 호출
    - iOS Safari: 설치 API가 없어 "공유 → 홈 화면에 추가" 3단계 안내 모달로 대체
  - 형태: 고정 오버레이(문서 흐름 밖 — CLS 방지). 모바일은 하단 전체 폭 바, 데스크톱(sm~)은 좌측 하단 pill
  - 노출 조건: standalone 실행 중이 아니고, 닫은 지 7일이 지났을 때. 스크롤 조건 없이 상시 노출
  - 이벤트 수신은 `layout.tsx`의 `next/script`(`beforeInteractive`)가 담당하고 컴포넌트는 구독만 한다
    (`beforeinstallprompt`는 페이지 로드당 1회만 발생하고 클라이언트 라우팅으로는 재발생하지 않음)
  - 배너 높이는 `globals.css`의 `--a2hs-banner-height` 하나로 관리 — 「맨 위로」 버튼 오프셋과
    `body.has-a2hs-banner`의 문서 하단 여백이 같은 값을 참조한다. **배너 높이를 바꾸면 이 변수도 함께 수정할 것**
  - 미해결: iOS는 설치 완료를 감지할 수 없어(`appinstalled` 미지원) 설치 후에도 Safari 탭에서는 배너가 계속 노출됨

- **[참고] PWA 개발 시 서비스 워커 stale 캐시 주의**
  - `npm start`로 한 번이라도 `localhost:3000`을 띄우면 서비스 워커가 등록되고,
    **같은 origin이라 `npm run dev`로 바꿔도 계속 요청을 가로챈다**.
    `next.config.ts`의 `disable: NODE_ENV === "development"`는 "새로 만들지 않는다"일 뿐 기존 등록을 지우지 않는다
  - 증상: 새로 추가한 Tailwind 클래스만 골라서 적용 안 됨(요소가 엉뚱한 위치에 렌더), 제거한 모듈을 참조하는 런타임 에러,
    하드 리로드하면 잠깐 정상이었다가 화면 이동 시 재발
  - 판별: `grep -o "\.클래스명{[^}]*}" .next/static/css/*.css` — 빌드 CSS에 있으면 코드가 아니라 캐시 문제다
  - 조치: DevTools → Application → Service Workers → 「네트워크 우회」 체크(DevTools 닫으면 풀림) + 등록 취소 + Clear site data.
    `public/sw.js`, `public/workbox-*.js` 삭제도 가능(gitignore 대상, 빌드 시 재생성)

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

- **[보류] 404/500 페이지에서 "이전 페이지" 버튼(BackButton) 클릭 후 GNB 애니메이션·인터랙션 불작동**
  - 증상: 404/500 같은 하드 네비게이션 페이지에서 `router.back()` 또는 `history.back()` 사용 시 이전 페이지로 돌아왔을 때 Header의 Framer Motion 애니메이션 및 hover 인터랙션이 동작하지 않음
  - "홈으로 가기"(`Link href="/"`) 클릭 시에는 정상 동작
  - 시도한 접근: bfcache `pageshow` 감지, `useEffect` → `useLayoutEffect` 변경, `isNavigatingRef` 네비게이션 가드, `BackButton` popstate+reload — 모두 미해결
  - 관련 파일: `src/components/shared/Header.tsx`, `src/components/shared/BackButton.tsx`, `src/app/not-found.tsx`, `src/app/error.tsx`
