'use client'
// 목록으로 버튼 — 같은 사이트에서 진입한 경우 router.back(), 외부 진입 시 fallbackHref로 이동

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Props {
  fallbackHref: string
  className?: string
  children?: React.ReactNode
}

export function BackToListLink({ fallbackHref, className, children = '← 목록으로' }: Props) {
  const router = useRouter()
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    const isSameSite = document.referrer.startsWith(window.location.origin)
    setCanGoBack(isSameSite)
  }, [])

  const handleClick = () => {
    if (canGoBack) router.back()
    else router.push(fallbackHref)
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
