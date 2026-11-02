// 유튜브 영상 상세 페이지용 VideoObject JSON-LD 헬퍼 단위 테스트
import { describe, it, expect } from 'vitest'
import { toJsonLdHtml, youtubeVideoObjectJsonLd } from './json-ld'

const BASE = {
  title: '기독교 100문 100답-제1강',
  description: '바로선교회 최한 목사의 기독교 100문100답 강좌입니다.',
  videoId: 'dQw4w9WgXcQ',
  thumbnailUrl: 'https://img.youtube.com/vi/dQw4w9WgXcQ/mqdefault.jpg',
  uploadDate: '2026-04-28T14:42:00.700089+00:00',
}

describe('youtubeVideoObjectJsonLd', () => {
  it('videoId로 유튜브 embed URL을 만든다', () => {
    expect(youtubeVideoObjectJsonLd(BASE).embedUrl).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ')
  })

  it('VideoObject 필드를 그대로 채운다', () => {
    const ld = youtubeVideoObjectJsonLd(BASE)
    expect(ld['@type']).toBe('VideoObject')
    expect(ld.name).toBe(BASE.title)
    expect(ld.description).toBe(BASE.description)
    expect(ld.thumbnailUrl).toBe(BASE.thumbnailUrl)
    expect(ld.uploadDate).toBe(BASE.uploadDate)
  })

  it('원본 파일 URL(contentUrl)은 넣지 않는다 — 유튜브 소유라 우리가 가진 주소가 없다', () => {
    expect(youtubeVideoObjectJsonLd(BASE)).not.toHaveProperty('contentUrl')
  })

  it('description이 비어 있으면 제목으로 대체한다 — 구글은 description 누락을 오류로 처리한다', () => {
    expect(youtubeVideoObjectJsonLd({ ...BASE, description: '' }).description).toBe(BASE.title)
  })
})

describe('toJsonLdHtml', () => {
  const evil = { name: 'x</script><script>alert(1)</script>' }

  it('<를 이스케이프해 사용자 입력이 <script> 태그를 닫지 못하게 한다', () => {
    const html = toJsonLdHtml(evil)
    expect(html).not.toContain('<')
    expect(html).not.toContain('</script>')
  })

  it('JSON으로 다시 읽으면 원래 값과 같다 — 구글이 읽는 데이터는 바뀌지 않는다', () => {
    expect(JSON.parse(toJsonLdHtml(evil))).toEqual(evil)
  })
})
