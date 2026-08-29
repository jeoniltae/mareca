import { describe, it, expect } from 'vitest'
import { philosophiaDescription, philosophiaKeywords } from './content-meta'

const INTRO = '우리나라에서 최초로 철학시가(Philosong)라는 음악의 한 장르를 개척하고자 합니다'
const CREDITS = 'CREDITS\nLyrics: 최더함\nMusic: Created with SUNO AI\nVideo & Editing: 최희진'
const TAGS = '#최더함 #철학시가 #Philosong #귀로듣는시'

/** 자막을 넣던 기존 글 (8건) */
const WITH_LYRICS = `${INTRO} \n\nSONG TITLE: 제주도에서\n\n${CREDITS}\n\n${TAGS}\n\n🎵 가사\n\n[음악]\n살다 보면 [음악]\n아픈 사랑이 [노래]\n있구나.\n잊지 못해. [음악] 너도 나도`

/** 자막을 뺀 기존 글 (3건) — 본문이 공통 문구뿐 */
const BOILERPLATE_ONLY = `${INTRO} \n\nSONG TITLE: 누군들\n\n${CREDITS}\n\n${TAGS}`

/** 앞으로 쓸 새 형식 — 맨 위에 그 시만의 해설 */
const NEW_FORMAT = `바다 앞에서 상처를 내려놓는 마음을 담았습니다. 제주 바다는 그걸 말없이 씻어주는 자리였습니다.\n\nSONG TITLE: 제주도에서\n\n${CREDITS}\n\n${INTRO}\n\n${TAGS} #제주도 #바다`

describe('philosophiaDescription', () => {
  it('가사가 있으면 가사에서 뽑고 자막 마커를 지운다', () => {
    const d = philosophiaDescription(WITH_LYRICS, '제주도에서')
    expect(d).toContain('살다 보면')
    expect(d).not.toContain('[음악]')
    expect(d).not.toContain('CREDITS')
    expect(d).not.toContain('우리나라에서 최초로')
  })

  it('가사가 없으면 공통 문단이 아닌 첫 문단을 쓴다', () => {
    const d = philosophiaDescription(NEW_FORMAT, '제주도에서')
    expect(d).toContain('바다 앞에서 상처를 내려놓는 마음')
    expect(d).not.toContain('SONG TITLE')
    expect(d).not.toContain('우리나라에서 최초로')
    expect(d).not.toContain('#')
  })

  it('본문이 공통 문구뿐이면 제목 기반 폴백', () => {
    expect(philosophiaDescription(BOILERPLATE_ONLY, '누군들')).toBe(
      '누군들 — 최더함의 철학시가. 시에 AI가 만든 곡조를 입혀 듣는 영상입니다.'
    )
  })

  it('본문이 없으면 제목 기반 폴백', () => {
    expect(philosophiaDescription(null, '본향')).toContain('본향 — 최더함의 철학시가')
  })

  it('해설이 소개문보다 아래에 있어도 찾아낸다', () => {
    const d = philosophiaDescription(`${INTRO}\n\n해설이 여기 있습니다.\n\n${TAGS}`, '제목')
    expect(d).toBe('해설이 여기 있습니다.')
  })

  it('글마다 서로 다른 description이 나온다', () => {
    const a = philosophiaDescription(BOILERPLATE_ONLY, '누군들')
    const b = philosophiaDescription(BOILERPLATE_ONLY, '제발 다시')
    expect(a).not.toBe(b)
  })

  it('120자를 넘지 않는다', () => {
    const long = `${'가'.repeat(500)}\n\n${TAGS}`
    expect(philosophiaDescription(long, '제목').length).toBeLessThanOrEqual(DESCRIPTION_LIMIT)
  })
})

const DESCRIPTION_LIMIT = 121 // truncateAtSentence가 말줄임표를 붙일 수 있어 1자 여유

describe('philosophiaKeywords', () => {
  it('#을 떼고 중복을 제거한다', () => {
    expect(philosophiaKeywords('#최더함 #철학시가 #최더함')).toEqual(['최더함', '철학시가'])
  })

  it('태그가 없으면 빈 배열', () => {
    expect(philosophiaKeywords('태그 없는 본문')).toEqual([])
    expect(philosophiaKeywords(null)).toEqual([])
  })

  it('본문 중간에 있는 태그도 잡는다', () => {
    expect(philosophiaKeywords(WITH_LYRICS)).toContain('귀로듣는시')
  })
})
