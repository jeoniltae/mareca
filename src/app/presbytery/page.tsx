import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '노회소개' }

export default function PresbyterPage() {
  return (
    <>
      <PageHeader
        title="노회소개"
        breadcrumbs={[{ label: '노회소개' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
