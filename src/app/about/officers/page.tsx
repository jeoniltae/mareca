import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '임원' }

export default function AboutOfficersPage() {
  return (
    <>
      <PageHeader
        title="임원"
        breadcrumbs={[{ label: '총회소개', href: '/about' }, { label: '임원' }]}
        backgroundImage="/images/breadcrumb/john_calvin.jpg"
        bgColor="bg-[#3b2410]"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
