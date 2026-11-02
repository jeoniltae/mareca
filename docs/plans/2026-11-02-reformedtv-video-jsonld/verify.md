# 검증 기록: 유튜브 영상 게시판 상세 — VideoObject JSON-LD 추가

- 검증일: 2026-11-02
- 대상 커밋: `47a4214` (검증 시작·종료 시 동일, 작업 트리 clean)
  - 포함 커밋: `e1fdf61` 헬퍼·테스트 / `a5f9c3d` 페이지 적용·board 필터 / `47a4214` 문서

## 검증 명령

| 명령 | 결과 |
|---|---|
| `npx vitest run` | exit 0 — 3 files, 23 tests passed (신규 `json-ld.test.ts` 4건 포함) |
| `npm run lint` | **exit 1 — 15 errors / 110 warnings. 전부 이번에 건드리지 않은 파일의 기존 오류** (`scripts/*.js` require, `react-hooks/set-state-in-effect` 등 11개 파일) |
| `npx eslint` (변경 파일 4개) | exit 0 |
| `npx tsc --noEmit` | exit 0 |
| `npm run build` | exit 0 — `✓ Compiled successfully` |

## 동작 확인

**전수 HTML 검사** — `npm run dev` 후 목록 페이지를 끝까지 돌며 모든 상세 HTML을 curl로 받아 검사.
불변식: 플레이어가 있으면 VideoObject가 정확히 1개이고 `embedUrl` 영상 ID가 플레이어 썸네일(`i.ytimg.com/vi/<id>`) ID와 같다. 플레이어가 없으면 VideoObject 0개.

| 게시판 | 글 수 | 통과 | 플레이어 없는 글 |
|---|---|---|---|
| ReformedTV | 81 | 81 | 0 |
| 철학시가 | 15 | 15 | 0 |

- 철학시가 VideoObject description이 Article description과 같은 값 (`philosophiaDescription`) — 표본 1건 확인
- board 격리 — 철학시가 글 id로 `/community/reformed-tv/<id>` 요청 시 `<title>`이 `ReformedTV | …` (그 글 제목 노출 안 됨). 자기 board 글은 정상 제목

**브라우저** — agent-browser, 뷰포트 390×844 (모바일 우선)

| 페이지 | 렌더 | 재생 |
|---|---|---|
| ReformedTV `정도를 벗어난 한국교회?` | 정상 (썸네일·재생 버튼·본문) | 클릭 전 iframe 0개 → 클릭 후 `youtube-nocookie.com/embed/RQ94zsw6atE?autoplay=1` 생성 |
| 철학시가 `참 다행입니다` | 정상 (다크 톤 유지) | 클릭 전 iframe 0개 → 클릭 후 `youtube-nocookie.com/embed/RdFpXqfGMcE?autoplay=1` 생성 |

## 남은 리스크

- **영상 없는 글에 VideoObject가 안 나오는지는 실측 못 함** — 실데이터 96건이 전부 영상 있는 글이다. `videoId &&` 조건으로 보장되며, 그런 글이 생기면 상세 HTML에서 `VideoObject` 0건인지 한 번 확인하면 된다 (리스크 하)
- **전체 lint 실패는 기존 부채** — 이번 변경과 무관하지만 `npm run lint`가 배포 게이트라면 별도 정리 필요
- **구글 인식 여부는 배포 후에만 확인 가능** — Rich Results Test "동영상" 오류 0건, Search Console "동영상" 보고서 (사용자 몫, `docs/todo.md`에 안내)
- 참고 — 이번 세션에서 dev 서버를 백그라운드로 띄웠다 멈출 때 `next start-server` 자식 프로세스가 3000 포트에 남는 현상이 두 번 있었다. 직접 종료함

## 리뷰 수정 후 재검증 (2026-11-02)

REVIEW에서 `toJsonLdHtml` 적용(XSS 수정)과 `description` 공유를 반영한 뒤 다시 실행. 기준: `d8af7c6` + 미커밋 변경 4개 파일.

| 명령 | 결과 |
|---|---|
| `npx vitest run` | exit 0 — 3 files, 25 tests passed (`toJsonLdHtml` 2건 추가: `<`·`</script>` 미포함, `JSON.parse` 왕복 동일) |
| `npx eslint` (변경 파일 4개) | exit 0 |
| `npx tsc --noEmit` | exit 0 |
| `npm run build` | exit 0 |

- **전수 HTML 재검사** — 이번에는 JSON-LD 블록을 실제 `JSON.parse`로 읽어 검사(이스케이프 후에도 유효 JSON인지).
  Article 1개 · VideoObject 1개 · `embedUrl` ID = 플레이어 ID. **ReformedTV 81/81, 철학시가 15/15 통과**
- **브라우저** — 철학시가 상세에서 재생 클릭 → `youtube-nocookie.com/embed/RdFpXqfGMcE?autoplay=1` iframe 생성
- 두 상세 페이지에 `JSON.stringify` 직접 사용 0건
