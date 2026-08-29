// 유튜브 썸네일을 실제로 받아보고 '존재하지 않는 영상'인지 판정한다. 브라우저 전용 (Image 사용)

/**
 * 유튜브는 없는 영상 ID에도 404가 아니라 120×90 회색 플레이스홀더를 준다.
 * 정상 mqdefault는 320×180이므로 폭으로 가려낸다.
 *
 * **판정하지 못하면 `false`(정상)로 돌려준다.** 네트워크가 느리거나 이미지 요청이 막혔을 때
 * 멀쩡한 영상의 등록을 막는 오탐이, 죽은 영상 하나를 통과시키는 미탐보다 나쁘기 때문이다.
 */
export function isYoutubeThumbnailMissing(thumbnailUrl: string, timeoutMs = 4000): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()

    const finish = (missing: boolean) => {
      clearTimeout(timer)
      img.onload = null
      img.onerror = null
      resolve(missing)
    }

    const timer = setTimeout(() => finish(false), timeoutMs)

    img.onload = () => finish(img.naturalWidth > 0 && img.naturalWidth <= 120)
    img.onerror = () => finish(false)
    img.src = thumbnailUrl
  })
}
