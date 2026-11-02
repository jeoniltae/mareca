# 유튜브 영상 게시판 상세 — VideoObject JSON-LD 추가 (SEO)

- 작성일: 2026-11-02
- 상태: 승인됨

## 배경 / 문제

ReformedTV·최더함의 철학시가 상세 페이지는 유튜브 영상이 핵심 콘텐츠인데, 구글에는 `Article` JSON-LD만 전달된다.
게다가 `YoutubePlayer`는 지연 로드(썸네일 + 재생 버튼, 클릭 시 iframe 삽입)라 구글 봇이 렌더링해도 영상 iframe이 없다.
그 결과 구글이 이 페이지들을 "영상 페이지"로 인식하지 못해 동영상 탭·영상 리치 결과(썸네일·재생 시간 표시) 대상에서 빠질 수 있다.

관련 선행 작업
- 본문(설명란)에 영상 내용을 글로 쓰는 운영은 코드 변경 없이 이미 시작했다 (평문, 마크다운 기호 없이)
- `posts.updated_at`이 조회수 증가에도 갱신되던 트리거 문제는 2026-10-24에 해결했다 (`docs/context-notes.md`)

## 목표

- ReformedTV·철학시가 상세 페이지에 유튜브용 `VideoObject` JSON-LD를 출력해, 구글이 페이지 안의 영상을 인식하게 한다
- 화면·영상 로드 방식·DB·폼은 바꾸지 않는다 (보이지 않는 `<script>` 추가만)

## 비목표 (이번에 하지 않는 것)

- 영상 로드 방식 변경 (`YoutubePlayer`를 즉시 iframe으로 바꾸는 것 등) — 성능 손해 대비 이득 없음, 스키마로 충분
- 기존 Mux용 `videoObjectJsonLd`(클럽소식) 수정·통합 — 입력·URL 체계가 달라 합치면 분기만 늘어난다
- `duration`(재생 시간) 필드 — 유튜브 Data API 호출이 필요해 범위 과다. 구글 권장 필드일 뿐 필수 아님
- 오픈강좌(`open-lecture`) 등 영상이 부수적인 다른 게시판 — 영상이 주 콘텐츠가 아니라 구글 영상 색인 조건에 맞지 않음
- 본문의 마크다운 렌더링 — 평문 운영으로 결정함
- 영상 사이트맵(video sitemap) — JSON-LD로 충분, 필요하면 후속
- (ponytail 점검) `Article` JSON-LD 제거 — 기존 SEO 동작을 바꿀 이유가 없어 유지. 둘을 함께 둬도 문제없다

## 사용자 시나리오

1. **방문자** → ReformedTV 상세(`/community/reformed-tv/{id}`)에서 → 페이지를 열면 → 화면·플레이어(썸네일 → 클릭 → 재생)가 변경 전과 동일하다
2. **방문자** → 철학시가 상세(`/community/philosophia/{id}`)에서 → 동일하게 → 다크 톤 화면·플레이어가 변경 전과 동일하다
3. **구글 봇(검증자)** → 두 게시판의 영상 있는 상세 페이지 HTML에서 → 소스를 보면 → `"@type":"VideoObject"` 스크립트가 1개 있고 `embedUrl`·`thumbnailUrl`이 그 글의 영상 ID와 일치한다
4. **구글 봇(검증자)** → 유튜브 링크가 없거나 파싱 안 되는 글에서 → 소스를 보면 → `VideoObject`가 없다 (`Article`만 있음)
5. **운영자** → 배포 후 Google Rich Results Test에 상세 URL을 넣으면 → "동영상" 항목이 오류 0건으로 인식된다
6. **방문자** → 철학시가 글 id로 ReformedTV 경로(또는 반대)를 요청하면 → not-found (기존 board 격리 유지, ReformedTV `generateMetadata`도 board로 격리)

## 설계 요약

- **헬퍼 신규** `youtubeVideoObjectJsonLd({ title, description, videoId, uploadDate? })` — `src/lib/json-ld.ts`의 Mux용 `videoObjectJsonLd` 바로 아래 (대화에서 확정)
  - `name` ← title
  - `description` ← description, 비어 있으면 title로 대체 (구글이 description 누락을 오류로 처리) (대화에서 확정)
  - `thumbnailUrl` ← `getYoutubeThumbnail(videoId)` 재사용 (`features/youtube/youtube-utils.ts`) (대화에서 확정)
  - `uploadDate` ← 게시글 `created_at` (대화에서 확정)
  - `embedUrl` ← `https://www.youtube.com/embed/{videoId}` (대화에서 확정)
  - `contentUrl` 없음 — 원본 파일 URL은 유튜브 소유 (대화에서 확정)
- **출력 조건** — `videoId`가 있을 때만, 기존 `Article` `<script>` 바로 아래에 두 번째 `<script>`로 (대화에서 확정). 패턴은 `club-news/news/[id]/page.tsx`의 Mux VideoObject와 동일
- **description 소스** — 각 페이지가 이미 Article에 쓰는 값을 그대로 쓴다
  - ReformedTV: `generateMetadata`와 같은 방식(태그 제거·공백 정리 후 120자)
  - 철학시가: `philosophiaDescription(post.content, post.title)` (자막 마커·공통 소개문 처리된 값)
- **적용 범위** — ReformedTV + 철학시가 두 상세 페이지 (사용자 결정, 2026-11-02)
- **곁다리** — ReformedTV `generateMetadata`에 `.eq('board', 'reformed-tv')` 추가. 철학시가는 이미 있음 (대화에서 확정)
- 영상 로드 방식·DB·폼 변경 없음 (대화에서 확정)

검토했지만 버린 안
- 기존 `videoObjectJsonLd`에 유튜브 분기 추가 — 입력 형태가 달라(playbackId vs videoId) 한 함수에 섞으면 호출부가 더 헷갈린다
- 상세 페이지에서 객체 리터럴로 직접 작성 — 두 페이지가 같은 로직을 복제하게 된다

## 영향 범위

- `src/lib/json-ld.ts` — 헬퍼 1개 추가
- `src/lib/json-ld.test.ts` — 신규 (Vitest 단위 테스트) (대화에서 확정)
- `src/app/community/reformed-tv/[id]/page.tsx` — VideoObject `<script>` 추가, `generateMetadata` board 필터
- `src/app/community/philosophia/[id]/page.tsx` — VideoObject `<script>` 추가
- 문서 — `CLAUDE.md` SEO 운영 가이드(자동 처리 목록), `docs/todo.md`, `docs/features/philosophia.md`(철학시가 변경 기록)
- 데이터·DB·API 변경 없음

## 성공 기준

- [ ] `npm test` 통과 — `youtubeVideoObjectJsonLd`의 `embedUrl`·`thumbnailUrl` 조립, 빈 description → title 대체를 검증
- [ ] `npm run build` 통과
- [ ] 두 게시판의 영상 있는 상세 HTML에 `"@type":"VideoObject"`가 정확히 1개, `embedUrl`의 영상 ID가 그 글의 것과 일치
- [ ] 영상 없는(또는 파싱 실패) 글에는 `VideoObject`가 없다
- [ ] 두 상세 페이지의 화면·플레이어 동작이 변경 전과 동일 (육안)
- [ ] ReformedTV `generateMetadata`가 다른 board 글 id에 대해 해당 글 제목을 내보내지 않는다
- [ ] (배포 후, 사용자 확인) Rich Results Test "동영상" 오류 0건

## 열린 질문

없음
