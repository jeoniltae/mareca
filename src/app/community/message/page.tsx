import { PageHeader } from '@/components/shared/PageHeader'
import { ComingSoon } from '@/components/shared/ComingSoon'

export const metadata = { title: '마스터스 메시지' }

export default function CommunityMessagePage() {
  return (
    <>
      <PageHeader
        title="마스터스 메시지"
        breadcrumbs={[{ label: '커뮤니티', href: '/community' }, { label: '마스터스 메시지' }]}
        backgroundImage="/images/breadcrumb/john_machen.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 40%"
      />
      <ComingSoon />
    </>
  )
}
