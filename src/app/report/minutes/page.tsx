import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '총회의사록' }

export default function ReportMinutesPage() {
  return (
    <>
      <PageHeader
        title="총회의사록"
        breadcrumbs={[{ label: '회의보고', href: '/report' }, { label: '총회의사록' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
