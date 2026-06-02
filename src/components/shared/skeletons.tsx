// 페이지별 재사용 스켈레톤 레이아웃 컴포넌트 모음
import { Skeleton } from '@/components/ui/skeleton'

// ─── 테이블형 게시판 목록 ─────────────────────────────────────────────────────
export function PostListSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 필터/검색 바 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-16 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-8 w-48 ml-auto rounded-md" />
      </div>

      {/* 게시글 수 */}
      <Skeleton className="h-4 w-24 mb-3" />

      {/* 목록 행 */}
      <div className="divide-y divide-slate-100 border-t border-slate-200">
        {[...Array(rows)].map((_, i) => (
          <div key={i} className="py-3 flex items-center gap-3">
            <Skeleton className="h-4 w-10 shrink-0" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-16 shrink-0 hidden sm:block" />
            <Skeleton className="h-4 w-12 shrink-0" />
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center gap-1 mt-8">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-md" />
        ))}
      </div>
    </div>
  )
}

// ─── 카드 그리드 (언론기사·행사앨범·영상 등) ─────────────────────────────────
export function PostGridSkeleton({ cols = 3, rows = 4 }: { cols?: number; rows?: number }) {
  const count = cols * rows
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* 필터/검색 바 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-2 flex-wrap">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-20 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-8 w-48 ml-auto rounded-md" />
      </div>

      {/* 카드 그리드 */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${cols} gap-4`}>
        {[...Array(count)].map((_, i) => (
          <div key={i} className="rounded-lg overflow-hidden border border-slate-100">
            <Skeleton className="w-full aspect-video" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex justify-center gap-1 mt-8">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-md" />
        ))}
      </div>
    </div>
  )
}

// ─── 게시글 상세 페이지 ───────────────────────────────────────────────────────
export function PostDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* 뒤로가기 */}
      <Skeleton className="h-4 w-24 mb-6" />

      {/* 메타정보 */}
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-14" />
      </div>

      {/* 제목 */}
      <Skeleton className="h-7 w-3/4 mb-2" />
      <Skeleton className="h-7 w-1/2 mb-8" />

      {/* 구분선 */}
      <div className="border-t border-slate-200 mb-8" />

      {/* 본문 */}
      <div className="space-y-3">
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 5 === 4 ? 'w-2/3' : 'w-full'}`} />
        ))}
        <div className="py-2" />
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className={`h-4 ${i % 4 === 3 ? 'w-1/2' : 'w-full'}`} />
        ))}
      </div>

      {/* 공유 버튼 영역 */}
      <div className="flex gap-2 mt-12">
        <Skeleton className="h-9 w-24 rounded-md" />
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
    </div>
  )
}

// ─── 메인 홈 페이지 ───────────────────────────────────────────────────────────
export function HomeSkeleton() {
  return (
    <div className="w-full">
      {/* 히어로 슬라이더 */}
      <Skeleton className="w-full h-[420px] sm:h-[540px] rounded-none" />

      {/* QuickInfo 섹션 (총회소식 + 공지 + 언론기사) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, col) => (
            <div key={col}>
              <div className="flex justify-between mb-4">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-12" />
              </div>
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-3 w-12 shrink-0 mt-0.5" />
                    <Skeleton className="h-3 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gallery 섹션 */}
      <div className="bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between mb-6">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-4 w-14" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      </div>

      {/* Videos 섹션 */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-14" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="w-full aspect-video rounded-lg" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── 도서 목록 (books 페이지) ─────────────────────────────────────────────────
export function BookListSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="w-full aspect-[3/4] rounded-md" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── 공개강좌 목록 ────────────────────────────────────────────────────────────
export function OpenLectureSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border border-slate-100 rounded-lg p-4 flex gap-4">
            <Skeleton className="w-32 aspect-video rounded shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-1 mt-8">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-md" />
        ))}
      </div>
    </div>
  )
}
