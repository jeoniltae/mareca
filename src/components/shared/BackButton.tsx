'use client'

interface BackButtonProps {
  className?: string
  label?: string
}

export function BackButton({ className, label = '이전 페이지' }: BackButtonProps) {
  const handleBack = () => {
    // 404/500 같은 하드 네비게이션 이후 history.back()은
    // Next.js 라우터 캐시가 비어있어 소프트 네비게이션이 불완전하게 처리될 수 있음.
    // popstate 발생 후 강제 full reload로 React/Framer Motion을 깨끗하게 재초기화함.
    const onPopState = () => {
      window.removeEventListener('popstate', onPopState)
      window.location.reload()
    }
    window.addEventListener('popstate', onPopState)
    window.history.back()
  }

  return (
    <button onClick={handleBack} className={className}>
      {label}
    </button>
  )
}
