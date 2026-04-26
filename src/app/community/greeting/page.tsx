import { PageHeader } from '@/components/shared/PageHeader'
import { ComingSoon } from '@/components/shared/ComingSoon'

export const metadata = { title: '주말인사' }

export default function CommunityGreetingPage() {
  return (
    <>
      <PageHeader
        title="주말인사"
        breadcrumbs={[{ label: '커뮤니티', href: '/community' }, { label: '주말인사' }]}
        backgroundImage="/images/breadcrumb/john_machen.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 40%"
      />
      <ComingSoon />
    </>
  )
}
