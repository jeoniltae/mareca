import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '경기' }

export default function PresbyterGyeonggiPage() {
  return (
    <>
      <PageHeader
        title="경기"
        breadcrumbs={[{ label: '노회소개', href: '/presbytery' }, { label: '경기' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
