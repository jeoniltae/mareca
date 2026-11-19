// ReformedTV 숏츠 본문에서 SEO용 description을 만든다. 본문 자체는 건드리지 않고 메타태그·JSON-LD·공유 문구에만 쓴다

import { truncateAtSentence } from '@/lib/text'
import { stripHashtags } from '@/lib/hashtags'

const DESCRIPTION_MAX = 120

const URL = /https?:\/\//

/**
 * 채널 공통 문구 줄. 숏츠마다 똑같이 붙어 있어 description에 의미를 더하지 않는다.
 * 줄 단위로 건너뛰기만 하므로 문구가 바뀌면 그 줄이 남을 뿐 깨지지 않는다
 */
const BOILERPLATE = [/^마스터스\s*Reformed\s*TV$/i, /^Soli\s+Deo\s+Gloria$/i, /^Semper\s+Reformanda$/i]

/**
 * 숏츠 상세 description — `{제목} — {정리된 본문}`.
 *
 * 같은 강의에서 잘라낸 숏츠는 본문이 글자 그대로 같아 본문만 쓰면 description이 중복된다.
 * 제목을 앞에 붙여 글마다 고유하게 만들고, 채널 URL·공통 문구·#태그는 뺀다.
 */
export function shortsDescription(content: string | null | undefined, title: string): string {
  const body = (content ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => !URL.test(line) && !BOILERPLATE.some((re) => re.test(line)))
    .map((line) => stripHashtags(line))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!body) return `${title} — 마스터스개혁파총회 ReformedTV 숏츠`
  return truncateAtSentence(`${title} — ${body}`, DESCRIPTION_MAX)
}
