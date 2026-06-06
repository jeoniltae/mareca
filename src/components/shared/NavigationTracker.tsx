'use client'
// 경로 변경을 감지해 목록 페이지 URL을 sessionStorage에 저장 — BackToListLink가 사용

import { useEffect, useRef } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

const LIST_HREF_KEY = 'listHref'

// [id] 세그먼트 패턴 (UUID 또는 숫자)
const DETAIL_SEGMENT = /^[0-9a-f-]{8,}$|^\d+$/i
const NON_LIST_SEGMENT = /^(new|edit)$/i

function isListPage(pathname: string) {
  const segments = pathname.split('/').filter(Boolean)
  const last = segments[segments.length - 1]
  return !last || (!DETAIL_SEGMENT.test(last) && !NON_LIST_SEGMENT.test(last))
}

export function NavigationTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const prevPathRef = useRef<string | null>(null)

  useEffect(() => {
    const fullPath = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')

    if (isListPage(pathname)) {
      sessionStorage.setItem(LIST_HREF_KEY, fullPath)
    }

    prevPathRef.current = fullPath
  }, [pathname, searchParams])

  return null
}
