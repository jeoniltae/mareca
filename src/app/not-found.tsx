import Link from 'next/link'
import { BackButton } from '@/components/shared/BackButton'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-[120px] sm:text-[160px] font-bold leading-none text-slate-100 select-none">
        404
      </p>

      <div className="-mt-4 sm:-mt-6 mb-6 space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-slate-500 text-base sm:text-lg">
          요청하신 페이지가 존재하지 않거나 주소가 변경되었습니다.
        </p>
        <p className="text-slate-400 text-sm">
          입력하신 URL을 다시 확인하시거나 아래 버튼으로 이동해주세요.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-md hover:bg-slate-700 transition-colors"
        >
          홈으로 가기
        </Link>
        <BackButton className="px-6 py-2.5 border border-slate-300 text-slate-600 text-sm font-medium rounded-md hover:bg-slate-50 transition-colors" />
      </div>
    </div>
  )
}
