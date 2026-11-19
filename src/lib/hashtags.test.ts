// 본문 #태그 추출·제거 유틸 단위 테스트
import { describe, it, expect } from 'vitest'
import { extractHashtags, stripHashtags } from './hashtags'

describe('extractHashtags', () => {
  it('#을 떼고 중복을 제거한다', () => {
    expect(extractHashtags('#최더함 #철학시가 #최더함')).toEqual(['최더함', '철학시가'])
  })

  it('태그가 없으면 빈 배열', () => {
    expect(extractHashtags('태그 없는 본문')).toEqual([])
    expect(extractHashtags(null)).toEqual([])
  })

  it('본문 중간에 있는 태그도 잡는다', () => {
    expect(extractHashtags('머리말\n\n#귀로듣는시\n\n🎵 가사\n살다 보면')).toContain('귀로듣는시')
  })

  it('여러 번 호출해도 결과가 같다 — 전역 정규식의 lastIndex가 남지 않는다', () => {
    const text = '#개혁신학 #칼빈'
    expect(extractHashtags(text)).toEqual(extractHashtags(text))
  })
})

describe('stripHashtags', () => {
  it('태그 자리를 공백으로 바꾸고 나머지 글은 남긴다', () => {
    expect(stripHashtags('본문입니다 #개혁신학 #칼빈').trim()).toBe('본문입니다')
  })

  it('태그가 없으면 그대로', () => {
    expect(stripHashtags('태그 없는 본문')).toBe('태그 없는 본문')
  })
})
