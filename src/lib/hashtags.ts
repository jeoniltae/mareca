// 게시글 본문에 적어둔 #태그를 SEO용으로 뽑거나 지운다. 본문 화면 출력에는 쓰지 않는다

/** `/g` 플래그라 `.test()`로 재사용하면 lastIndex가 남는다 — 모듈 밖으로 내보내지 않는다 */
const HASHTAG = /#[^\s#]+/g

/** JSON-LD keywords용. `#`는 떼고 중복은 제거한다 */
export function extractHashtags(content: string | null | undefined): string[] {
  if (!content) return []
  const found = content.match(HASHTAG) ?? []
  return [...new Set(found.map((tag) => tag.slice(1)).filter(Boolean))]
}

/** description용. 태그 자리를 공백으로 바꾼다 (공백 정리는 호출하는 쪽 몫) */
export function stripHashtags(text: string): string {
  return text.replace(HASHTAG, ' ')
}
