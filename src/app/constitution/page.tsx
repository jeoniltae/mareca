import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '총회헌법' }

export default function ConstitutionPage() {
  return (
    <>
      <PageHeader
        title="총회헌법"
        breadcrumbs={[{ label: '총회헌법' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
