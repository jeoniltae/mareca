import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '총회조직 및 사역원칙' }

export default function AboutOrganizationPage() {
  return (
    <>
      <PageHeader
        title="총회조직 및 사역원칙"
        breadcrumbs={[{ label: '총회소개', href: '/about' }, { label: '총회조직 및 사역원칙' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
