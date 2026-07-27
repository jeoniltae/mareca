const SENTENCE_END = /[.!?…。？！]/

/**
 * 문장 경계에서 잘라 말이 끊기지 않게 한다.
 * 1순위: max 이내의 마지막 문장 종결부호 / 2순위: 단어(공백) 경계 + 말줄임표
 */
export function truncateAtSentence(text: string, max: number): string {
  const trimmed = text.trim()
  if (trimmed.length <= max) return trimmed

  const window = trimmed.slice(0, max)

  // 소수점(3.5)이나 URL이 문장 끝으로 잡히지 않도록 뒤에 공백이 오는 경우만 인정
  for (let i = window.length - 1; i >= 0; i--) {
    if (!SENTENCE_END.test(window[i])) continue
    const next = window[i + 1]
    if (next !== undefined && !/\s/.test(next)) continue
    // 너무 짧게 잘리면 문장 경계를 포기하고 아래 단어 경계로 넘어간다
    if (i + 1 >= max * 0.5) return window.slice(0, i + 1)
    break
  }

  const space = window.lastIndexOf(' ')
  const cut = space >= max * 0.5 ? window.slice(0, space) : window
  return `${cut.trimEnd()}…`
}
