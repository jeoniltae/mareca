# 검증 기록: 본문 해시태그 SEO 활용

- 검증 대상 커밋: `f4dbf2b` (작업 트리 깨끗 — 작업 1~6 전부 사용자 커밋 완료 상태)
- 검증일: 2026-11-19

## 검증 명령

| 명령 | 결과 |
|---|---|
| `npx vitest run` | 5 files · **35 passed** (exit 0) — 대문자 `C:` 경로에서 실행 |
| `npx eslint <변경 파일 10개>` | exit 0 |
| `npm run lint` (전체) | exit 1 — 15 errors · 110 warnings. **기존 파일 오류**(2026-11-02 기록과 같은 15건), 변경 파일은 위에서 0건 |
| `npx tsc --noEmit` | exit 0 |
| `npm run build` | exit 0 (`Compiled successfully`) |

## 실제 앱 동작 확인

개발 서버(`next dev --webpack`, 포트 3100)에 실제 게시물 8건과 not-found 2건을 요청해 HTML을 파싱했다.
변경 전 기준 스냅샷(BUILD 시작 전, 커밋 `468f790` 상태)과 비교했다.

| 시나리오 (spec) | 대상 | 결과 |
|---|---|---|
| 1 검색 스니펫 | 숏츠 3건 | meta·og·twitter description = `{제목} — {강의명}`. 채널 URL·`Soli Deo Gloria`·`#` 없음 |
| 2 JSON-LD keywords | 숏츠(태그 있음) 2건 | Article·VideoObject `keywords` 16/16. 태그 없는 숏츠는 0/0(필드 생략) |
| 3 같은 본문 숏츠 | "사람은 죽어도 진리는 죽지 않는다" / "왜 교황을 따르지 않는가" | description **서로 다름** (변경 전에는 동일) |
| 4 카카오 공유 | 숏츠 3건 · 철학시가 2건 | RSC 페이로드의 `ShareButtons` `description`이 meta description과 같고 `#` 없음 |
| 5 일반 영상 불변 | 일반 3건(태그 있는 글 1건 포함) | meta·og·twitter·Article·VideoObject **변경 전과 완전히 동일**. 공유 문구도 기존대로 원문 |
| 6 본문 태그 표시 | 숏츠·철학시가 | 화면 본문에 `#태그` 그대로 출력 |
| 철학시가 | 2건 | 변경점은 `VideoObject.keywords`(13개) **하나뿐**. description·Article 동일 |
| not-found (프로젝트 의무) | 철학시가 id → reformed-tv 경로 / 숏츠 id → philosophia 경로 | 404 화면, JSON-LD 0건 (HTTP 200은 기존 동작) |

## 검증 중 발생한 환경 문제 (코드와 무관)

- **vitest 드라이브 문자** — 소문자 `c:` 경로에서 실행하면 기존 테스트 포함 전 파일이 `Cannot read properties of undefined (reading 'config')`로 실패. 대문자 `C:`에서는 정상
- **개발 서버 잔존 프로세스** — TaskStop으로 내린 `npx next dev`의 자식 node 프로세스가 3100 포트에 남아 있었고, 그 상태에서 `npm run build`가 `.next`를 덮어써 `Jest worker encountered 2 child process exceptions` 500이 났다.
  첫 실행 결과는 폐기하고, 포트 점유 프로세스를 종료한 뒤 서버를 새로 띄워 **처음부터 다시** 확인했다(위 표가 재실행 결과)
- Turbopack 개발 서버는 메모리 할당 실패로 죽어 `--webpack`을 썼다 (빌드도 `--webpack`)

## 남은 리스크

- 숏츠 본문 형식이 실측 2종(강의형 · 연합예배형)과 크게 다른 글은 줄 제거 규칙이 덜 걸러질 수 있다(예: 마크다운 `*`). 제목이 앞에 오므로 스니펫 핵심은 유지 — 수용
- 구글 Rich Results Test · Search Console 반영은 배포 후 사용자 확인 몫
