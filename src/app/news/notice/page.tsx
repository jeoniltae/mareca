import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '공지사항' }

export default function NewsNoticePage() {
  return (
    <>
      <PageHeader
        title="공지사항"
        breadcrumbs={[{ label: '소식', href: '/news' }, { label: '공지사항' }]}
        backgroundImage="/images/cornelius_vantil.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 26%"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
