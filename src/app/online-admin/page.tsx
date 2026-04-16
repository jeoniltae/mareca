import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '온라인행정' }

export default function OnlineAdminPage() {
  return (
    <>
      <PageHeader
        title="온라인행정"
        breadcrumbs={[{ label: '온라인행정' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
