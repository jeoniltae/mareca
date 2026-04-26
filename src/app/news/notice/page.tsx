import { PageHeader } from '@/components/shared/PageHeader'
import { ComingSoon } from '@/components/shared/ComingSoon'

export const metadata = { title: '공지사항' }

export default function NewsNoticePage() {
  return (
    <>
      <PageHeader
        title="공지사항"
        breadcrumbs={[{ label: '소식', href: '/news' }, { label: '공지사항' }]}
        backgroundImage="/images/breadcrumb/cornelius_vantil.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 26%"
      />
      <ComingSoon />
    </>
  )
}
