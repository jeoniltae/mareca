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

- **[완료] 게시판 에디터 HTML 소스 편집기 추가**
  - 배경: 본문은 현재 `PostEditor.tsx`(Tiptap v3) 툴바로만 작성 가능. 관리자가 외부 마크업을 붙여넣거나 툴바로 표현이 어려운 구조(중첩 테이블, 세밀한 정렬)를 손보려면 소스 단계 편집이 필요함
  - 목표: 관리자에게만 툴바에 `</>` 토글을 노출해 본문 HTML을 직접 편집
  - 확정 사항:
    - 권한은 `getIsAdmin`(`profiles.is_admin = true`)만 사용 — `masters@mareca.kr`는 제외
    - 소스 편집 결과는 **반드시 `editor.commands.setContent()`를 거쳐** Tiptap 스키마로 정규화된 뒤에만 폼 상태로 전달. 정규화되지 않은 원본 HTML이 저장될 경로를 만들지 않는다
    - 서버 sanitize는 이번 범위 밖 — 선행 취약점이므로 아래 별도 항목으로 분리
    - `PostForm`을 쓰는 24개 페이지에 `isAdmin` prop을 넘기지 않고, `PostEditor`가 Server Action으로 직접 조회
    - `OpenLectureForm.tsx`, `open-lecture/actions.ts`는 손대지 않음 (PostEditor 내부 변경만으로 충족)
    - 신규 의존성 없음 / 신규 소스 파일 없음
  - 1단계 — 이미지 URL 정규식 보강 (독립 커밋)
    - [x] `PostForm.tsx:74` → `/<img[^>]+src=["']([^"']+)["']/g`
    - [x] `posts/actions.ts:162`(`extractStorageImagePaths`) → 동일 패턴
    - [x] `npm run build` 통과 확인
    - 상세 페이지 13곳의 OG 이미지 추출 정규식은 건드리지 않음(범위 밖)
  - 2단계 — 관리자 조회 Server Action
    - [x] `posts/actions.ts`에 `import { getIsAdmin } from '@/lib/admin'` 추가
    - [x] `export async function isEditorAdmin(): Promise<boolean> { return getIsAdmin() }` 추가 (`uploadImage` 위 별도 섹션)
    - UI 노출 제어일 뿐, 실질적 안전장치는 3단계의 Tiptap 정규화다
  - 3단계 — `PostEditor.tsx` 소스 편집 모드 (파일 위→아래 순서로 적용)
    - [x] import 보강 — `Code2`(lucide-react), `isEditorAdmin`, `useEffect`
    - [x] state 3개 추가 — `isAdmin` / `showSource` / `sourceHtml`
    - [x] `useEffect`로 마운트 시 `isEditorAdmin()` 호출 — **`if (!editor) return null`보다 반드시 위**
    - [x] `applySource` 추가 — `setContent(sourceHtml)`. **`setContent`는 `emitUpdate` 기본값이 `true`라 `onUpdate` → `onChange`가 알아서 발화한다**(처음엔 반대로 알고 `onChange`를 명시 호출했으나 중복이라 제거 — 코드리뷰에서 정정)
    - [x] 실제로 고쳤을 때만 반영하도록 `appliedSourceRef` 가드 추가 — 구경만 하고 닫아도 본문이 정규화되던 문제, 실행취소 스택에 중복 쌓이던 문제 동시 해결
    - [x] `flush()` 통로 추가 (`PostEditorHandle`) — macOS Safari·Firefox는 버튼 클릭 시 blur가 안 나서 소스 본문이 저장되지 않던 문제. `PostForm`·`OpenLectureForm`이 제출 직전 호출
    - [x] `toggleSource` 추가 — 켤 때 `formatHtml(getHTML())` 세팅 + 팝오버 3개 닫기, 끌 때 `applySource()`
    - [x] 툴바에 `isAdmin && <Btn onClick={toggleSource} active={showSource} title="HTML 소스 편집">` 추가 (undo/redo 뒤)
    - [x] 소스 모드에서 나머지 툴바 숨김 — 숨겨진 에디터를 조작해도 `applySource()`가 덮어써 조용히 사라지므로
      - 툴바 전체를 `{!showSource && (<> … </>)}`로 감쌌다. 감싼 구간은 **들여쓰기를 그대로 뒀다** — 240줄 재정렬 diff가 실제 변경을 가린다. 정리하려면 공백만 바꾸는 별도 커밋으로
      - `</>` 앞 `<Divider />`는 `isAdmin` 안에 넣고 `!showSource` 조건도 걸었다 — 비관리자일 때 꼬리 구분선, 소스 모드일 때 앞머리 구분선이 남는 것을 막기 위함
    - [x] textarea + 안내 문구(`에디터가 지원하지 않는 태그·속성은 적용 시 제거됩니다.`) 렌더, `onBlur={applySource}`
    - [x] `EditorContent`는 언마운트하지 말고 `cn('bg-white', showSource && 'hidden')`으로 감춤 (인스턴스·undo 히스토리 보존)
    - [x] 파일 하단에 `formatHtml` 로컬 함수 추가 — 블록 닫는 태그 뒤에만 개행
    - [x] `npm run build` 통과 확인
  - 4단계 — 자동 검증
    - [x] `npm test` — **9개 통과.** `image-urls.test.ts` 추가로 이 저장소에서 처음으로 실제 검증이 돌아간다. `vitest.config.ts`의 `environment`를 `jsdom`(미설치라 실행 불가) → `node`로 변경
    - [x] `npm run build` 타입 에러 없음
    - [x] `npx eslint`로 수정한 3개 파일만 검사 — 깨끗함. (`npm run lint` 전체는 기존 에러/경고 다수 — `set-state-in-effect`, `no-img-element`, `public/sw.js` 빌드 산출물)
  - 5단계 — 수동 검증 (`npm run dev`)
    - [x] 관리자 계정 `/community/free/new`에 `</>` 버튼 노출
    - [x] 토글 시 HTML이 블록 단위로 개행되어 보임
    - [x] 소스에 `<p style="text-align:center">` 추가 → 토글 해제 시 WYSIWYG 반영
    - [x] **소스 모드인 채로 바로 [등록]** → 정규화된 내용 저장 (이번 설계의 핵심 케이스 — blur가 click보다 먼저 발생함을 확인)
    - [x] `<script>alert(1)</script>` 입력 → 토글 해제 시 Tiptap이 제거
    - [x] `<img src='...'>`(작은따옴표) 저장 → 1단계 정규식이 잡는지
    - [x] 비관리자 계정에서 `</>` 버튼 안 보임
    - [x] 기존 게시글 수정 시 소스 모드를 한 번도 안 열면 서식 그대로 (회귀 확인)
    - [x] `/community/open-lecture/new` 카테고리 `공지`에서도 정상 동작 (PostEditor 공유)
    - 2026-08-25 사용자 수동 검증 완료 — 전 항목 이상 없음
  - 6단계 — 문서 기록
    - [x] `docs/context-notes.md` `## 2026-08-25` 섹션에 결정 기록 — 관리자 한정 이유, Tiptap 정규화로 sanitize 없이 현행 수준 유지한 근거, sanitize 분리 배경, blur 설계, 들여쓰기 유지 결정, 검증 한계
    - [x] 이 항목 `[완료]` 표기 + 후속 항목 2건 등록(서버 sanitize, 고아 파일 이탈 경로)

- **[미착수] 게시글 본문 서버 sanitize 도입 (선행 취약점)**
  - 배경: `createPost` / `updatePost`가 `content`를 검증 없이 저장하고 13개 상세 페이지가 `dangerouslySetInnerHTML`로 렌더 → 조작된 요청으로 저장된 XSS를 막을 수단이 없다. **HTML 소스 편집기와 무관하게 이미 존재하는 문제**이며, 소스 편집 결과가 항상 Tiptap을 통과하므로 그 기능이 새로 만드는 위험은 아니다
  - 방향: `sanitize-html` 도입 후 `createPost` / `updatePost`의 `content`에 화이트리스트 적용
  - 주의: Tiptap이 생성하는 `style="text-align:…"`(TextAlign), `<span style="color:…">`(Color), `<mark>`(Highlight), `colspan`/`rowspan`/`colwidth`(Table), `class`(Image·Link)를 모두 허용해야 한다. 하나라도 빠지면 기존 글 재저장 시 서식이 파괴된다
  - 주의: 오픈강좌는 `category !== '공지'`일 때 본문이 평문이라 sanitize하면 `<`가 escape된다 — 조건부 적용 필요

- **[미착수] 에디터 이미지 고아 파일 — 탭 닫기·뒤로가기 경로 정리**
  - 배경: 현재 에디터 업로드 이미지 정리는 [취소] 버튼을 눌러 확인 모달에서 확정할 때만 동작한다.
    `PostForm.tsx`의 `onImageUploaded` → `editorImageUrls` 누적 → 취소 확정 시 `deleteEditorImages(editorImageUrls)` 흐름
  - **브라우저 탭을 닫거나 뒤로가기·GNB 클릭으로 이탈하면 이 핸들러가 실행되지 않아** 업로드된 파일이 `post-images` 버킷에 그대로 남는다
  - HTML 소스 편집기와 무관한 선행 문제다. 정리 로직이 본문 HTML이 아니라 업로드 시점(`onImageUploaded`)을 추적하므로 소스 편집 여부에 영향받지 않는다 (2026-08-25 확인)
  - 해결 방향 두 가지 — 택일 또는 병행
    1. **`beforeunload` 경고** — 작성 중 이탈 시 브라우저 기본 확인창. 구현이 가볍지만 탭 닫기만 막고 Next.js 클라이언트 라우팅 이탈은 못 잡는다. 라우팅 이탈까지 막으려면 `next/navigation` 가드가 추가로 필요
    2. **주기적 미참조 파일 청소** — GitHub Actions cron으로 `post-images` 버킷 목록과 `posts.content` / `post_images`를 대조해 어디서도 참조되지 않는 파일 삭제. 이탈 경로와 무관하게 확실하지만, **작성 중인 글의 이미지를 지우지 않도록 업로드 후 N시간 유예를 반드시 둘 것**
  - 권장: 2번(청소 배치)이 근본 해결. 1번만으로는 경로가 남는다
  - 관련 파일: `src/features/posts/PostForm.tsx`, `src/features/posts/actions.ts`(`deleteEditorImages`), `.github/workflows/`

- **[보류] 404/500 페이지에서 "이전 페이지" 버튼(BackButton) 클릭 후 GNB 애니메이션·인터랙션 불작동**
  - 증상: 404/500 같은 하드 네비게이션 페이지에서 `router.back()` 또는 `history.back()` 사용 시 이전 페이지로 돌아왔을 때 Header의 Framer Motion 애니메이션 및 hover 인터랙션이 동작하지 않음
  - "홈으로 가기"(`Link href="/"`) 클릭 시에는 정상 동작
  - 시도한 접근: bfcache `pageshow` 감지, `useEffect` → `useLayoutEffect` 변경, `isNavigatingRef` 네비게이션 가드, `BackButton` popstate+reload — 모두 미해결
  - 관련 파일: `src/components/shared/Header.tsx`, `src/components/shared/BackButton.tsx`, `src/app/not-found.tsx`, `src/app/error.tsx`

- **[완료] 게시판 추가 — 최더함의 철학시가 (1차: 목록 화면 디자인)**
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

- **[미착수] 게시판 추가 — 최더함의 철학시가 (2차: DB 연동 · 상세/등록/수정 · SEO)**
  - 기능 명세는 **ReformedTV와 동일**하다. 아래는 `src/app/community/reformed-tv/*`, `src/features/reformed-tv/*`를 전수 확인해 1:1 대응시킨 목록이다
  - 1차(목록 화면 디자인)는 완료. 위 항목 참조

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

  ### 3단계 — 목록 페이지 DB 연동
  - [ ] `src/app/community/philosophia/page.tsx` 수정 — `MOCK_VIDEOS` → Supabase 쿼리
    - `select('id, title, youtube_url, views, created_at, category, profiles(nickname)', { count: 'exact' })`
      + `.eq('board','philosophia')` + `created_at` 역순 + `.range(from, to)`, 카테고리 필터는 `.eq('category', ...)`
    - `PAGE_SIZE = 12` **확정**. **`Pagination` 컴포넌트 부착** — 1차에서는 목업 8건이라 뺐다
    - `Pagination`도 라이트 톤이라 다크 배경 위 대비 확인 필요 (B안 범위에 포함)
    - 썸네일을 목업 오선 플레이스홀더 → `getYoutubeThumbnail()` 실제 이미지로 교체.
      **`videoId`가 없을 때의 플레이스홀더 폴백은 유지한다** (1차 디자인 자산)
    - `NNN ENTRIES` 카운트를 `videos.length` → 전체 `count`로 교체
    - `[영상 등록]` 버튼을 `supabase.auth.getUser()` 결과로 **로그인 사용자에게만 노출**
    - **카드 우측 상단 연작 라벨 제거** — 연작을 쓰지 않기로 확정했다.
      제거 후 넘버링(`01`)만 남는 카드 상단 여백이 허전하지 않은지 확인할 것
    - **`STAGGER` 배열을 8개 → 12개로 확장** (`PAGE_SIZE=12`와 일치시킨다).
      정적 문자열 배열이라 `[animation-delay:770ms]`까지 4개를 70ms 간격으로 추가하면 된다
  - [ ] `src/features/philosophia/mock-videos.ts` **삭제** (연동 완료 후)

  ### 4단계 — 상세 페이지 (다크 — B안)
  - [ ] `PhilosophiaHero` 일반화 — 지금은 제목·breadcrumb·인트로가 전부 하드코딩이다.
    `title` / `breadcrumbs` prop을 받고 인트로 블록은 목록에서만 렌더하도록 분기 (상세·목록 공용)
  - [ ] `src/app/community/philosophia/[id]/page.tsx` 신규 — `reformed-tv/[id]/page.tsx` 대응
    - `generateMetadata` — title/description(본문 태그 제거 후 120자)/OG/Twitter/canonical.
      OG 이미지는 유튜브 썸네일, 없으면 `/images/logo.png`
    - 본문 조회 시 `.eq('board','philosophia')` 필수 (다른 게시판 글이 이 경로로 열리는 것 방지)
    - `YoutubePlayer`는 **1단계에서 옮긴 `@/features/youtube/YoutubePlayer`를 import**한다
    - `ViewTracker`(`boardPath="/community/philosophia"`), `ShareButtons`, `BackToListLink`, `articleJsonLd` 배치
    - 작성자·수정 권한: `isAuthor || isAdmin`일 때만 `PhilosophiaActions` 노출
    - **다크 적용** — 배경·본문·메타를 목록과 같은 토큰으로. 라이트 톤인 `ShareButtons`·`BackToListLink`·
      `PhilosophiaActions` 버튼이 다크 배경에서 읽히는지 확인하고, 안 되면 이 페이지에서만 클래스를 덮어쓴다
      (공용 컴포넌트 자체는 수정하지 않는다 — 다른 24개 게시판에 영향)
    - `YoutubePlayer`는 `rounded-xl shadow-md`라 라운드 0 격자와 충돌한다. 상세에서 감싸는 쪽에서 조정할지 확인
  - [ ] `src/features/philosophia/PhilosophiaActions.tsx` 신규 — 수정/삭제 버튼 + `ConfirmDialog` 2종 (`ReformedTVActions` 대응)

  ### 5단계 — 등록 · 수정 페이지 (라이트 — B안 범위 밖)
  - [ ] `src/features/philosophia/PhilosophiaForm.tsx` 신규 — `ReformedTVForm` 대응. **기존 라이트 톤 그대로**
    - 필드: 카테고리(라디오 `일반`/`숏츠` 필수) · 유튜브 URL(필수, `extractYoutubeId`로 유효성 검사 + 썸네일 미리보기) ·
      제목(필수) · 설명(textarea, 선택). **연작 입력 필드는 없다**
    - `mode: 'create' | 'edit'` 양용, 취소 시 `ConfirmModal` 확인, `isRedirectError` 재throw 처리
  - [ ] `src/app/community/philosophia/new/page.tsx` 신규 — 비로그인 `redirect('/login?next=/community/philosophia/new')`.
    `PageHeader`(라이트) 사용
  - [ ] `src/app/community/philosophia/[id]/edit/page.tsx` 신규 — 비로그인 리다이렉트 +
    `!post || (!isAdmin && post.user_id !== user.id)`이면 `notFound()`
  - [ ] **1차의 `[영상 등록]` 링크 404가 이 단계에서 해소된다**
  - [ ] 다크(목록·상세) → 라이트(폼) 전환이 의도된 경계임을 확인. 어색하면 폼 진입 버튼 위치나 문구로 완충

  ### 6단계 — 로딩 스켈레톤
  - [ ] `src/app/community/philosophia/loading.tsx` 신규 — 목록용
  - [ ] `src/app/community/philosophia/[id]/loading.tsx` 신규 — 상세용
  - [ ] **기존 `PostGridSkeleton` / `VideoDetailSkeleton`은 라이트 톤이라 다크 배경에서 흰 판이 번쩍인다.**
    B안이므로 목록·상세 두 곳 모두 해당된다 → **다크 전용 스켈레톤이 필요하다.**
    공용 `skeletons.tsx`는 24개 게시판이 함께 쓰므로 수정하지 말고,
    `features/philosophia/` 안에 이 코너 전용으로 만든다 (헤어라인 격자 + 네이비 톤)

  ### 7단계 — SEO · 사이트 등록
  - [ ] `src/app/sitemap.ts` — `BOARD_PATH_MAP`에 `'philosophia': '/community/philosophia'` 추가
  - [ ] `src/app/sitemap.ts` — `STATIC_ROUTES`에 `/community/philosophia` 추가 (`weekly` / `0.7`, reformed-tv와 동일)
  - [ ] `public/llms.txt` — `## 커뮤니티` 섹션에 한 줄 추가
  - [x] `Header.tsx` GNB 메뉴 — **1차에서 이미 완료**(커뮤니티 서브메뉴, ReformedTV 다음). 2차 작업 아님
  - [ ] 비로그인 접근 가능한 공개 게시판이므로 사이트맵·llms.txt 제외 대상이 아니다 (CLAUDE.md SEO 가이드 확인 완료)

  ### 8단계 — 검증
  - [ ] `npm run build` 통과
  - [ ] `npx eslint`로 신규·수정 파일만 검사
  - [ ] 수동 — 등록 → 목록 노출 → 상세 진입 → 조회수 증가 → 수정 → 삭제 전체 흐름
  - [ ] 수동 — 비로그인 시 목록·상세는 보이고 `[영상 등록]`은 안 보이는지, `/new` 직접 접근 시 로그인으로 리다이렉트되는지
  - [ ] 수동 — 타인 글 수정/삭제 차단, 관리자 계정은 허용되는지
  - [ ] 수동 — 13건 이상 등록해 `Pagination` 2페이지 동작 + 카테고리 필터와 페이지 파라미터 조합 확인
  - [ ] 수동 — 숏츠(세로 영상) 썸네일이 16:9 카드에서 깨지지 않는지
  - [ ] 수동 — 다크(목록·상세) ↔ 라이트(등록·수정) 전환 시 어색함 없는지
  - [ ] 수동 — 375 / 768 / 1440px

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
