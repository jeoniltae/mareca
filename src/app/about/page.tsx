import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = {
  title: '총회소개',
}

export default function AboutPage() {
  return (
    <>
      <PageHeader
        title="총회소개"
        breadcrumbs={[{ label: '총회소개' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* 서브 탭 (선택사항 — 하위 메뉴가 있을 때 사용) */}
        <nav className="flex gap-1 border-b border-slate-200 mb-8">
          {['인사말', '총회역사', '조직 및 임원', '신앙고백'].map((tab, i) => (
            <button
              key={tab}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                i === 0
                  ? 'border-sky-600 text-sky-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>

        {/* 본문 영역 — 실제 콘텐츠로 교체 */}
        <div className="prose prose-slate max-w-none">
          <p className="text-slate-500 text-sm">콘텐츠 준비 중입니다.</p>
        </div>
      </div>
    </>
  )
}
