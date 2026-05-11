const TZ = 'Asia/Seoul'

/** 2025년 5월 5일 오전 10:30 */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return ''
  return new Date(value).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: TZ,
  })
}

/** 2025년 5월 5일 오전 10시 30분 */
export function formatDateTimeVerbose(value: string | null | undefined): string {
  if (!value) return ''
  return new Date(value).toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: TZ,
  })
}

/** 올해: 05-09 / 작년 이전: '25.12.03 (목록용 짧은 날짜) */
export function formatMonthDay(value: string | null | undefined): string {
  if (!value) return ''
  const d = new Date(new Date(value).toLocaleString('en-US', { timeZone: TZ }))
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: TZ }))
  if (d.getFullYear() === now.getFullYear()) {
    return `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  }
  return `'${String(d.getFullYear()).slice(2)}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

/** 2025.05.05 (앨범/미디어 목록용) */
export function formatYMD(value: string | null | undefined): string {
  if (!value) return ''
  const d = new Date(new Date(value).toLocaleString('en-US', { timeZone: TZ }))
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

/** NEW 뱃지 판정 (한국 시간 기준 24시간) */
export function isNewPost(value: string | null | undefined): boolean {
  if (!value) return false
  return Date.now() - new Date(value).getTime() < 1000 * 60 * 60 * 24
}
