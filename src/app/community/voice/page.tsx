import { PageHeader } from '@/components/shared/PageHeader'
import { ComingSoon } from '@/components/shared/ComingSoon'

export const metadata = { title: 'Plus Voice' }

export default function CommunityVoicePage() {
  return (
    <>
      <PageHeader
        title="Plus Voice"
        breadcrumbs={[{ label: '커뮤니티', href: '/community' }, { label: 'Plus Voice' }]}
        backgroundImage="/images/breadcrumb/john_machen.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 40%"
      />
      <ComingSoon />
    </>
  )
}
