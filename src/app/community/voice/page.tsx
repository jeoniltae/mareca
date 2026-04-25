import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: 'Plus Voice' }

export default function CommunityVoicePage() {
  return (
    <>
      <PageHeader
        title="Plus Voice"
        breadcrumbs={[{ label: '커뮤니티', href: '/community' }, { label: 'Plus Voice' }]}
        backgroundImage="/images/john_machen.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 40%"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
