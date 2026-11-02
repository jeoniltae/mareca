---
plans_dir: docs/plans
design: existing          # 기존 shadcn/ui·Tailwind 토큰을 따른다. 철학시가처럼 전용 톤이 있는 게시판은 그 톤을 따른다
test: npx vitest run      # npm test는 watch 모드라 끝나지 않는다
base_branch: main         # Vercel이 main push 시 자동 배포
---

# feature-workflow 프로젝트 설정

<!-- 비밀값·실제 개인정보를 적지 않는다. 상세 규칙은 원문 문서 경로로 가리킨다. -->

## DEFINE
- 기능을 손대기 전에 `docs/features/<기능>.md`가 있으면 읽고, spec "배경"에 관련 결정을 반영한다
- `docs/todo.md`에 같은 주제의 미착수·보류 항목이 있으면 spec에 연결한다
- DB 컬럼·테이블을 바꾸는 기능이면 spec "영향 범위"에 바뀌는 테이블·컬럼과 DDL 필요 여부를 적는다

## PLAN
- 문서 갱신(`docs/todo.md`, 해당되면 `docs/features/<기능>.md`)을 별도 작업으로 넣는다
- DB 컬럼을 바꾸면: DDL 실행(사용자 몫) → `npm run db:types` → `docs/context-notes.md`에 DDL 기록을 작업으로 넣는다
- 새 테이블이면: `CLAUDE.md` "Supabase Data API GRANT 정책"의 GRANT 구문을 DDL에 포함한다
- 새 페이지·게시판·동적 라우트면: `CLAUDE.md` "SEO 운영 가이드 › 새 페이지/게시판 추가 시" 항목을 작업으로 넣는다 (접근 제한 경로는 sitemap·llms.txt 제외)

## BUILD
- 코딩 규칙·금지 사항: `docs/coding-guidelines.md` ("하지 말아야 할 것", 새 파일 첫 줄 한국어 주석)
- 컨벤션: `CLAUDE.md` "코드 컨벤션" (named export, `cn()`, 인라인 스타일 금지, Server Component 기본)
- 코드의 `mareca.kr` 이메일은 Supabase 계정용 더미다. 실제 도메인은 `mareca.org`. 새 실제 주소를 만들지 않는다
- 테스트는 유틸 함수 단위 테스트(Vitest)만 쓴다. 컴포넌트·E2E 테스트는 추가하지 않는다 (의도적 결정)
- 커밋: `docs/coding-guidelines.md` §9(시맨틱 커밋)를 따른다. 작업 하나가 검증까지 끝나면 SHIP을 기다리지 않고 커밋한다
  (push는 프로덕션 배포라 SHIP에서 확인 후). 스킬의 "커밋은 SHIP에서만" 규칙보다 이 항목이 우선한다 (2026-11-02 사용자 결정)

## VERIFY
- 린트는 `npm run lint`, 빌드는 `npm run build`
- 게시판 상세를 건드렸으면: 다른 board 글 id로 같은 경로를 요청해 not-found가 나오는지 확인한다 (not-found가 HTTP 200인 것은 기존 동작)
- 로그인·권한이 걸린 화면을 건드렸으면: 로그아웃 상태 직접 URL 진입 + 화면 이동 두 경로로 확인한다
- `npm start`로 확인했다면 서비스 워커 stale 캐시에 주의한다 (`docs/todo.md` "PWA 개발 시 서비스 워커 stale 캐시 주의")

## REVIEW
- `docs/coding-guidelines.md` "하지 말아야 할 것" 항목을 diff에 대조한다
- 사용자 입력을 `dangerouslySetInnerHTML`로 렌더하는 경로가 새로 생기지 않았는지 확인한다 (서버 sanitize 미도입 상태 — `docs/todo.md`)
- 새 경로가 접근 제한 영역(`/resources/*`, `/report/minutes`, `/online-admin/*`)이면 sitemap·llms.txt에 들어가지 않았는지 확인한다

## SHIP
- `docs/todo.md`의 해당 항목 상태를 갱신한다 (`[미착수]` / `[보류]` / `[완료]`, 완료 항목도 지우지 않는다)
- 작업 중 결정과 DDL은 `docs/context-notes.md` 맨 위(최신순)에 기록한다
- 기능별 문서(`docs/features/<기능>.md`)가 있으면 갱신한다
- `CLAUDE.md`의 구조표·DB 스키마·SEO 가이드가 바뀌었으면 갱신한다
- 커밋 메시지는 git 기록 형식을 따른다: `<type>: <한국어 요약> - <상세 항목>` (feat / fix / docs …)
- main push는 곧 프로덕션 배포다. 푸시 전에 한 번 더 확인받는다
