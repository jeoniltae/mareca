import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '구인구직' }

export default function CommunityJobsPage() {
  return (
    <>
      <PageHeader
        title="구인구직"
        breadcrumbs={[{ label: '커뮤니티', href: '/community' }, { label: '구인구직' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
