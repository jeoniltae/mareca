'use client'
// 게시글 조회수를 마운트 시 1회만 증가시키는 클라이언트 컴포넌트

import { useEffect, useRef } from 'react'

interface ViewTrackerProps {
  action: () => Promise<void>
}

export function ViewTracker({ action }: ViewTrackerProps) {
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true
    action()
  }, [action])

  return null
}
