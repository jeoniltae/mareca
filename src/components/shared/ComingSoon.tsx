export function ComingSoon() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center px-4 py-20">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-bold text-slate-700 mb-2">준비 중입니다</h2>
        <p className="text-sm text-slate-400 leading-relaxed">
          더 나은 서비스 제공을 위해 페이지를 준비하고 있습니다.<br />
          빠른 시일 내에 찾아뵙겠습니다.
        </p>
      </div>
    </div>
  )
}
