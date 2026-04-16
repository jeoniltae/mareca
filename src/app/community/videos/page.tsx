import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: 'Masters Videos' }

export default function CommunityVideosPage() {
  return (
    <>
      <PageHeader
        title="Masters Videos"
        breadcrumbs={[{ label: '커뮤니티', href: '/community' }, { label: 'Masters Videos' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
