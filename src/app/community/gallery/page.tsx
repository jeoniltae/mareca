import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '갤러리' }

export default function CommunityGalleryPage() {
  return (
    <>
      <PageHeader
        title="갤러리"
        breadcrumbs={[{ label: '커뮤니티', href: '/community' }, { label: '갤러리' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
