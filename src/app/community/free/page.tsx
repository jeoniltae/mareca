import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '자유게시판' }

export default function CommunityFreePage() {
  return (
    <>
      <PageHeader
        title="자유게시판"
        breadcrumbs={[{ label: '커뮤니티', href: '/community' }, { label: '자유게시판' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
