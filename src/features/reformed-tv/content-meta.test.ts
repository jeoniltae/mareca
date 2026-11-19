// ReformedTV 숏츠 description 생성 유틸 단위 테스트 — 본문은 실제 게시물 형식(2026-11-19 실측)
import { describe, it, expect } from 'vitest'
import { shortsDescription } from './content-meta'

/** 100문 100답 강의에서 잘라낸 숏츠 — 같은 강의의 숏츠끼리 본문이 글자 그대로 같다 */
const LECTURE =
  '최더함 목사의 기독교 100문 100답\r\n제26강 종교개혁가 순례(1) 종교개혁의 선구자들\r\n\r\n마스터스 Reformed TV \r\nhttps://www.youtube.com/@mastersreformedtv\r\n\r\nSoli Deo Gloria\r\nSemper Reformanda\r\n\r\n\r\n#최더함 #최더함의기독교100문100답 #기독교100문100답 #종교개혁 #존위클리프 #얀후스'

/** 연합예배 숏츠 — 채널 문구 없이 본문 + 태그 */
const WORSHIP =
  '*종교개혁 509주년 기념주일 | 마스터스 개혁파 총회 소속교회 연합예배*\r\n\r\n“오직 성경, 오직 믿음, 오직 은혜, 오직 그리스도, 오직 하나님께 영광!”\r\n\r\n#종교개혁기념주일 #종교개혁509주년 #바로선개혁교회'

const LIMIT = 121 // truncateAtSentence가 말줄임표를 붙일 수 있어 1자 여유

describe('shortsDescription', () => {
  it('제목 뒤에 강의명을 붙이고 채널 URL·공통 문구·태그는 뺀다', () => {
    expect(shortsDescription(LECTURE, '왜 교황을 따르지 않는가')).toBe(
      '왜 교황을 따르지 않는가 — 최더함 목사의 기독교 100문 100답 제26강 종교개혁가 순례(1) 종교개혁의 선구자들'
    )
  })

  it('본문이 같아도 제목이 다르면 결과가 다르다', () => {
    expect(shortsDescription(LECTURE, '사람은 죽어도 진리는 죽지 않는다')).not.toBe(
      shortsDescription(LECTURE, '왜 교황을 따르지 않는가')
    )
  })

  it('채널 문구가 없는 형식에서도 태그만 빼고 본문을 쓴다', () => {
    const d = shortsDescription(WORSHIP, '우리의 생일을 모른다')
    expect(d.startsWith('우리의 생일을 모른다 — ')).toBe(true)
    expect(d).toContain('오직 성경')
    expect(d).not.toContain('#')
  })

  it('본문이 비거나 공통 문구·태그뿐이면 폴백', () => {
    const fallback = '제목 — 마스터스개혁파총회 ReformedTV 숏츠'
    expect(shortsDescription(null, '제목')).toBe(fallback)
    expect(shortsDescription('Soli Deo Gloria\nhttps://example.com\n#태그', '제목')).toBe(fallback)
  })

  it('120자를 넘지 않는다', () => {
    expect(shortsDescription('가 '.repeat(300), '제목').length).toBeLessThanOrEqual(LIMIT)
  })
})
