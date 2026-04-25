import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '주말인사' }

export default function CommunityGreetingPage() {
  return (
    <>
      <PageHeader
        title="주말인사"
        breadcrumbs={[{ label: '커뮤니티', href: '/community' }, { label: '주말인사' }]}
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
