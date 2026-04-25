import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '마스터스 메시지' }

export default function CommunityMessagePage() {
  return (
    <>
      <PageHeader
        title="마스터스 메시지"
        breadcrumbs={[{ label: '커뮤니티', href: '/community' }, { label: '마스터스 메시지' }]}
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
