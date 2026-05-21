'use client'
// 목록으로 링크 — fallbackHref로 이동

import Link from 'next/link'

interface Props {
  fallbackHref: string
  className?: string
  children?: React.ReactNode
}

export function BackToListLink({ fallbackHref, className, children = '← 목록으로' }: Props) {
  return (
    <Link href={fallbackHref} className={className}>
      {children}
    </Link>
  )
}
