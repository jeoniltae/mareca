// HTML 콘텐츠 내 이미지 URL 링크를 <img> 태그로 변환하는 유틸리티

const IMAGE_EXT_RE = /\.(jpg|jpeg|png|gif|webp|svg|avif)(\?[^"']*)?$/i

/**
 * <a href="이미지URL">...</a> 형태의 링크를 <img> 태그로 교체한다.
 * 이미지 확장자를 가진 href만 변환하고 일반 링크는 그대로 유지한다.
 */
export function transformImageLinks(html: string): string {
  return html.replace(
    /<a([^>]+)href=["']([^"']+)["']([^>]*)>([^<]*)<\/a>/gi,
    (match, _before, href, _after, _text) => {
      if (IMAGE_EXT_RE.test(href)) {
        return `<img src="${href}" alt="" class="max-w-full rounded-lg my-2" />`
      }
      return match
    },
  )
}
