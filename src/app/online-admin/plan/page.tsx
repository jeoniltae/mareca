import { PageHeader } from '@/components/shared/PageHeader'
import { ComingSoon } from '@/components/shared/ComingSoon'

export const metadata = { title: '교회계획' }

export default function OnlineAdminPlanPage() {
  return (
    <>
      <PageHeader
        title="교회계획"
        breadcrumbs={[{ label: '온라인행정', href: '/online-admin' }, { label: '교회계획' }]}
        backgroundImage="/images/breadcrumb/abraham_kuyper.png"
        bgColor="bg-slate-800"
        imagePosition="center 22%"
      />
      <ComingSoon />
    </>
  )
}
