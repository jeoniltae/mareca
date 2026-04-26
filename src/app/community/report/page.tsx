import { PageHeader } from '@/components/shared/PageHeader'
import { ComingSoon } from '@/components/shared/ComingSoon'

export const metadata = { title: '확정보고' }

export default function CommunityReportPage() {
  return (
    <>
      <PageHeader
        title="확정보고"
        breadcrumbs={[{ label: '커뮤니티', href: '/community' }, { label: '확정보고' }]}
        backgroundImage="/images/breadcrumb/john_machen.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 40%"
      />
      <ComingSoon />
    </>
  )
}
