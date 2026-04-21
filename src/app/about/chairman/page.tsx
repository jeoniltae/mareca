import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '이사장' }

export default function AboutChairmanPage() {
  return (
    <>
      <PageHeader
        title="이사장"
        breadcrumbs={[{ label: '총회소개', href: '/about' }, { label: '이사장' }]}
        backgroundImage="/images/breadcrumb/john_calvin.jpg"
        bgColor="bg-[#3b2410]"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
