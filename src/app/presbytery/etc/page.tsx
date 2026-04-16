import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '기타' }

export default function PresbyterEtcPage() {
  return (
    <>
      <PageHeader
        title="기타"
        breadcrumbs={[{ label: '노회소개', href: '/presbytery' }, { label: '기타' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
