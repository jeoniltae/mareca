'use client'
// 게시글 조회수를 마운트 시 1회만 증가시키는 클라이언트 컴포넌트

import { useEffect, useRef } from 'react'
import { incrementViews } from './actions'

interface ViewTrackerProps {
  id: string
}

export function ViewTracker({ id }: ViewTrackerProps) {
  const called = useRef(false)

  useEffect(() => {
    if (called.current) return
    called.current = true
    incrementViews(id)
  }, [id])

  return null
}
