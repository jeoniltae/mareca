// 철학시가 본문에서 SEO용 메타 정보를 뽑는다. 본문 자체는 건드리지 않고 메타태그·JSON-LD를 만들 때만 쓴다

import { truncateAtSentence } from '@/lib/text'

/** 자막을 넣던 시기의 글에서 공통 머리말(소개문·CREDITS·해시태그)의 끝을 알리는 표식 */
const LYRICS_MARKER = '🎵 가사'

/** 유튜브 자동 자막이 남기는 마커 — `[음악]` `[노래]` 같은 한글 1~5자 대괄호와 `>>` */
const CAPTION_NOISE = /\[[가-힣]{1,5}\]|>>/g
const HASHTAG = /#[^\s#]+/g

const DESCRIPTION_MAX = 120

/**
 * 모든 글에 똑같이 들어가는 문단들. 여기서 description을 뽑으면 전 글이 같은 문장이 된다.
 * 코너 공통 소개문의 문구를 바꾸면 첫 줄 패턴도 함께 고칠 것.
 */
const BOILERPLATE = [
  /^우리나라에서 최초로 철학시가/,
  /^SONG\s*TITLE/i,
  /^CREDITS/i,
  /^(Lyrics|Music|Video)\s*[&:]/i,
  /^#/,
]

const isBoilerplate = (paragraph: string) => BOILERPLATE.some((re) => re.test(paragraph))

const clean = (text: string) =>
  text.replace(CAPTION_NOISE, ' ').replace(HASHTAG, ' ').replace(/\s+/g, ' ').trim()

/**
 * 상세 페이지 description.
 *
 * 본문을 앞에서부터 그대로 자르면 모든 글이 같은 소개문·CREDITS로 시작해 description이 전부 똑같아진다.
 * 그래서 그 글에만 있는 내용을 찾아 쓴다.
 *
 * 1. `🎵 가사`가 있으면 그 이후 — 자막을 넣던 기존 글
 * 2. 없으면 공통 문단이 아닌 첫 문단 — 가사 대신 시 해설을 쓰는 새 형식
 * 3. 둘 다 없으면 제목 기반 폴백 — 본문이 공통 문구뿐인 글
 */
export function philosophiaDescription(content: string | null | undefined, title: string): string {
  const fallback = `${title} — 최더함의 철학시가. 시에 AI가 만든 곡조를 입혀 듣는 영상입니다.`
  if (!content) return fallback

  const markerAt = content.indexOf(LYRICS_MARKER)
  if (markerAt >= 0) {
    const lyrics = clean(content.slice(markerAt + LYRICS_MARKER.length))
    if (lyrics) return truncateAtSentence(lyrics, DESCRIPTION_MAX)
  }

  // 소개문을 위에 두든 아래에 두든 상관없이, 공통 문단을 건너뛰고 그 글만의 문단을 집는다
  const paragraph = content
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p.length > 0 && !isBoilerplate(p))

  if (paragraph) {
    const cleaned = clean(paragraph)
    if (cleaned) return truncateAtSentence(cleaned, DESCRIPTION_MAX)
  }

  return fallback
}

/** 본문에 적어둔 `#태그`를 JSON-LD keywords용으로 뽑는다. `#`는 떼고 중복은 제거한다 */
export function philosophiaKeywords(content: string | null | undefined): string[] {
  if (!content) return []
  const found = content.match(HASHTAG) ?? []
  return [...new Set(found.map((tag) => tag.slice(1)).filter(Boolean))]
}
