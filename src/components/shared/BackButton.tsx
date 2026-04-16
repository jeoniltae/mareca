'use client'

import { useRouter } from 'next/navigation'

interface BackButtonProps {
  className?: string
  label?: string
}

export function BackButton({ className, label = '이전 페이지' }: BackButtonProps) {
  const router = useRouter()

  return (
    <button
      onClick={() => router.back()}
      className={className}
    >
      {label}
    </button>
  )
}
