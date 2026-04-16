'use client'

import Link from 'next/link'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-[120px] sm:text-[160px] font-bold leading-none text-slate-100 select-none">
        500
      </p>

      <div className="-mt-4 sm:-mt-6 mb-6 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          서버 오류가 발생했습니다
        </h1>
        <p className="text-slate-500 text-base sm:text-lg">
          일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.
        </p>
        <p className="text-slate-400 text-sm">
          문제가 지속되면 관리자에게 문의해주세요.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="px-6 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 border border-slate-300 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors"
        >
          홈으로 가기
        </Link>
      </div>
    </div>
  )
}
