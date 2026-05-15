'use client'
// 뒤로가기 기능이 있는 목록으로 링크 — 같은 도메인에서 왔으면 router.back(), 외부에서 직접 접근했으면 fallbackHref로 이동

import { useRouter } from 'next/navigation'

interface Props {
  fallbackHref: string
  className?: string
  children?: React.ReactNode
}

export function BackToListLink({ fallbackHref, className, children = '← 목록으로' }: Props) {
  const router = useRouter()

  function handleClick() {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackHref)
    }
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
