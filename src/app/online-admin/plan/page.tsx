import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '교회계획' }

export default function OnlineAdminPlanPage() {
  return (
    <>
      <PageHeader
        title="교회계획"
        breadcrumbs={[{ label: '온라인행정', href: '/online-admin' }, { label: '교회계획' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
