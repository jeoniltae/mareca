import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '신앙고백' }

export default function AboutConfessionPage() {
  return (
    <>
      <PageHeader
        title="신앙고백"
        breadcrumbs={[{ label: '총회소개', href: '/about' }, { label: '신앙고백' }]}
        backgroundImage="/images/breadcrumb/john_calvin.jpg"
        bgColor="bg-[#3b2410]"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
