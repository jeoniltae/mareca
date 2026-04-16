import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '연혁 및 주요 행사' }

export default function AboutHistoryPage() {
  return (
    <>
      <PageHeader
        title="연혁 및 주요 행사"
        breadcrumbs={[{ label: '총회소개', href: '/about' }, { label: '연혁 및 주요 행사' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
