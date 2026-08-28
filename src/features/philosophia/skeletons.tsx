// 최더함의 철학시가 전용 로딩 스켈레톤 — 공용 skeletons.tsx는 라이트 톤이라 네이비 배경에서 흰 판이 번쩍인다. 히어로는 데이터가 필요 없어 실제 컴포넌트를 그대로 렌더해 전환 시 흔들림을 없앤다

import { PhilosophiaHero } from './PhilosophiaHero'

const BASE_PATH = '/community/philosophia'

const BREADCRUMBS = [
  { label: '커뮤니티', href: '/community' },
  { label: '최더함의 철학시가', href: BASE_PATH },
]

// 실제 화면과 같은 라운드 0 · 헤어라인 톤을 유지한다
function Bar({ className }: { className: string }) {
  return <span className={`block animate-pulse bg-[#EDE7D6]/10 ${className}`} />
}

// 카드 8개 — 4열 기준 두 줄이라 첫 화면을 채우면서도 PAGE_SIZE(12)만큼 길게 늘어지지 않는다
const CARD_COUNT = 8

export function PhilosophiaListSkeleton() {
  return (
    <div className="bg-[#14243F]">
      <PhilosophiaHero breadcrumbs={[{ label: '커뮤니티', href: '/community' }, { label: '최더함의 철학시가' }]} />

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
      {/* 게시글 제목은 아직 모르므로 breadcrumb 마지막 항목은 비운다 */}
      <PhilosophiaHero variant="compact" breadcrumbs={BREADCRUMBS} />

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
