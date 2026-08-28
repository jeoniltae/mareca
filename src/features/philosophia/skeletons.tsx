// 최더함의 철학시가 전용 로딩 스켈레톤 — 공용 skeletons.tsx는 라이트 톤이라 네이비 배경에서 흰 판이 번쩍인다.
// 폴백 트리는 실제 페이지와 컴포넌트를 하나도 공유하지 않는다(순수 마크업만). 같은 컴포넌트를 같은 위치에 두면
// 폴백→콘텐츠 전환 때 fiber가 Suspense 경계를 가로질러 재조정되면서 React가 async info 회계 에러를 냈다.

// 실제 화면과 같은 라운드 0 · 헤어라인 톤을 유지한다
function Bar({ className }: { className: string }) {
  return <span className={`block animate-pulse bg-[#EDE7D6]/10 ${className}`} />
}

// 히어로 자리 — PhilosophiaHero를 재사용하지 않고 배경·텍스처·여백만 같은 껍데기를 직접 그린다
function HeroShell({ compact = false }: { compact?: boolean }) {
  return (
    <section className="relative overflow-hidden bg-[#182B4E]" aria-hidden>
      <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_15px,rgba(237,231,214,0.07)_15px,rgba(237,231,214,0.07)_16px)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-[#D9B441]/50 to-transparent" />

      <div
        className={`relative mx-auto grid max-w-7xl px-4 sm:px-6 lg:px-8 ${
          compact ? 'py-10 sm:py-12' : 'gap-12 py-14 sm:py-20 lg:grid-cols-[1.35fr_1fr] lg:gap-0'
        }`}
      >
        <div className={compact ? undefined : 'lg:pr-14'}>
          <Bar className="h-4 w-64" />
          <Bar className={compact ? 'mt-4 h-9 w-72 sm:h-11' : 'mt-6 h-11 w-80 sm:h-16 sm:w-104 lg:h-20 lg:w-136'} />
          <span className={`block h-px w-20 bg-[#D9B441]/80 ${compact ? 'mt-5' : 'mt-8'}`} />
          <Bar className={`h-4 w-56 ${compact ? 'mt-5' : 'mt-8'}`} />
        </div>

        {!compact && (
          <div className="border-t border-[#EDE7D6]/15 pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-14">
            <Bar className="h-4 w-40" />
            <div className="mt-6 space-y-5">
              <div className="space-y-2">
                <Bar className="h-5 w-full" />
                <Bar className="h-5 w-11/12" />
              </div>
              <div className="space-y-2">
                <Bar className="h-5 w-full" />
                <Bar className="h-5 w-4/5" />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// 카드 8개 — 4열 기준 두 줄이라 첫 화면을 채우면서도 PAGE_SIZE(12)만큼 길게 늘어지지 않는다
const CARD_COUNT = 8

export function PhilosophiaListSkeleton() {
  return (
    <div className="bg-[#14243F]">
      <HeroShell />

      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(237,231,214,0.07)_1px,transparent_1px)] bg-size-[22px_22px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8" aria-hidden>
          {/* 툴바 */}
          <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Bar className="h-5 w-10" />
            <Bar className="h-5 w-10" />
            <Bar className="h-5 w-10" />
            <Bar className="order-1 h-4 w-32 sm:order-0" />
            <Bar className="ml-auto h-10 w-32 rounded-full sm:order-1" />
          </div>

          {/* 그리드 — 실제 목록과 동일한 헤어라인 격자 */}
          <div className="grid grid-cols-1 border-t border-l border-[#EDE7D6]/15 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: CARD_COUNT }).map((_, i) => (
              <div key={i} className="flex flex-col gap-6 border-r border-b border-[#EDE7D6]/15 p-6">
                <Bar className="h-7 w-12" />
                <div className="aspect-video border border-[#EDE7D6]/15 bg-[#101D34]" />
                <div className="flex flex-1 flex-col justify-between gap-6">
                  <div className="space-y-2">
                    <Bar className="h-5 w-full" />
                    <Bar className="h-5 w-2/3" />
                  </div>
                  <Bar className="h-4 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export function PhilosophiaDetailSkeleton() {
  return (
    <div className="bg-[#14243F]">
      <HeroShell compact />

      <section className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(237,231,214,0.07)_1px,transparent_1px)] bg-size-[22px_22px]"
        />

        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8" aria-hidden>
          {/* 제목 & 메타 */}
          <div className="border-b border-[#EDE7D6]/15 pb-6">
            <Bar className="h-8 w-3/4" />
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Bar className="h-4 w-24" />
              <Bar className="h-4 w-40" />
              <Bar className="h-4 w-12" />
            </div>
          </div>

          {/* 플레이어 */}
          <div className="mt-10 aspect-video border border-[#EDE7D6]/15 bg-[#101D34]" />

          {/* 설명 */}
          <div className="mt-10 space-y-3">
            <Bar className="h-5 w-full" />
            <Bar className="h-5 w-5/6" />
            <Bar className="h-5 w-2/3" />
          </div>

          {/* 공유 */}
          <div className="mt-12 flex gap-2 border-t border-[#EDE7D6]/15 pt-8">
            <Bar className="h-10 w-36 rounded-xl" />
            <Bar className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </section>
    </div>
  )
}
