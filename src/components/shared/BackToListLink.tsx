'use client'
// 목록으로 버튼 — sessionStorage에 기록된 이전 목록 경로로 복원, 외부 진입 시 fallbackHref로 이동

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const SESSION_KEY = 'listHref'

interface Props {
  fallbackHref: string
  className?: string
  children?: React.ReactNode
}

export function BackToListLink({ fallbackHref, className, children = '← 목록으로' }: Props) {
  const router = useRouter()
  const [href, setHref] = useState<string | null>(null)

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY)
    setHref(saved)
  }, [])

  const handleClick = () => {
    router.push(href ?? fallbackHref)
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
