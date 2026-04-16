import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '목회자료실' }

export default function ResourcesPastoralPage() {
  return (
    <>
      <PageHeader
        title="목회자료실"
        breadcrumbs={[{ label: '마스터스자료실', href: '/resources' }, { label: '목회자료실' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
