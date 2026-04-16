import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '커뮤니티' }

export default function CommunityPage() {
  return (
    <>
      <PageHeader
        title="커뮤니티"
        breadcrumbs={[{ label: '커뮤니티' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
