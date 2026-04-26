import { PageHeader } from '@/components/shared/PageHeader'
import { ComingSoon } from '@/components/shared/ComingSoon'

export const metadata = { title: '총회로고' }

export default function AboutLogoPage() {
  return (
    <>
      <PageHeader
        title="총회로고"
        breadcrumbs={[{ label: '총회소개', href: '/about' }, { label: '총회로고' }]}
        backgroundImage="/images/breadcrumb/john_calvin.jpg"
        bgColor="bg-slate-800"
      />
      <ComingSoon />
    </>
  )
}
