// extractImageUrls 정규식 회귀 테스트 — 이 정규식은 과거 세 번 고쳐졌고 매번 다른 케이스가 깨졌다

import { describe, it, expect } from 'vitest'
import { extractImageUrls } from './image-urls'

describe('extractImageUrls', () => {
  it('큰따옴표 src를 뽑는다 (에디터가 저장하는 기본 형태)', () => {
    expect(extractImageUrls('<img src="a.png">')).toEqual(['a.png'])
  })

  it('작은따옴표 src를 뽑는다 (이관·외부 유입 콘텐츠)', () => {
    expect(extractImageUrls("<img src='a.png'>")).toEqual(['a.png'])
  })

  it('src 앞에 다른 속성이 와도 뽑는다', () => {
    expect(extractImageUrls('<img alt="사진" src="a.png">')).toEqual(['a.png'])
  })

  it('실제 저장 형태(class가 먼저 오는 Tiptap 출력)를 뽑는다', () => {
    const html = '<img class="max-w-full rounded-lg my-2" src="https://s.co/storage/v1/object/public/post-images/u/1.png">'
    expect(extractImageUrls(html)).toEqual(['https://s.co/storage/v1/object/public/post-images/u/1.png'])
  })

  it('본문에 있는 이미지를 순서대로 모두 뽑는다', () => {
    const html = `<img src="1.png"><p>글</p><img src='2.png'>`
    expect(extractImageUrls(html)).toEqual(['1.png', '2.png'])
  })

  // ─── 아래 두 개가 과거에 실제로 깨졌던 케이스다 ───

  it('URL 안에 반대쪽 따옴표가 있어도 자르지 않는다', () => {
    // 짝을 안 맞추면(["']([^"']+)["']) "https://x.co/a" 까지만 잡혀
    // 아직 참조 중인 파일을 지울 수 있었다
    expect(extractImageUrls(`<img src="https://x.co/a'b.png">`)).toEqual([
      "https://x.co/a'b.png",
    ])
  })

  it('다른 속성값 안의 src= 문자열에 낚이지 않는다', () => {
    // [^>]+가 탐욕적이면 태그 안 마지막 src=로 역추적해 x.png를 잡았다.
    // Tiptap이 title/alt를 보존하므로 소스 편집기로 실제 만들 수 있는 입력이다
    expect(extractImageUrls(`<img src="real.png" title="src='x.png'">`)).toEqual([
      'real.png',
    ])
  })

  it('이미지가 없으면 빈 배열', () => {
    expect(extractImageUrls('<p>글만 있음</p>')).toEqual([])
    expect(extractImageUrls('')).toEqual([])
  })

  it('연속 호출해도 결과가 같다 (모듈 레벨 정규식의 lastIndex 오염 방지)', () => {
    const html = '<img src="a.png"><img src="b.png">'
    expect(extractImageUrls(html)).toEqual(['a.png', 'b.png'])
    expect(extractImageUrls(html)).toEqual(['a.png', 'b.png'])
  })
})
