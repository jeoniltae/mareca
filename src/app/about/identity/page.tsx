import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '우리는 누구인가?' }

export default function AboutIdentityPage() {
  return (
    <>
      <PageHeader
        title="우리는 누구인가?"
        breadcrumbs={[{ label: '총회소개', href: '/about' }, { label: '우리는 누구인가?' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
