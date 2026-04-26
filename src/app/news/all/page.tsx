import { PageHeader } from '@/components/shared/PageHeader'
import { ComingSoon } from '@/components/shared/ComingSoon'

export const metadata = { title: '소식' }

export default function NewsAllPage() {
  return (
    <>
      <PageHeader
        title="소식"
        breadcrumbs={[{ label: '소식', href: '/news' }, { label: '소식' }]}
        backgroundImage="/images/breadcrumb/cornelius_vantil.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 26%"
      />
      <ComingSoon />
    </>
  )
}
