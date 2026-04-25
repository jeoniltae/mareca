import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '설교자료실' }

export default function ResourcesSermonPage() {
  return (
    <>
      <PageHeader
        title="설교자료실"
        breadcrumbs={[{ label: '마스터스자료실', href: '/resources' }, { label: '설교자료실' }]}
        backgroundImage="/images/bb_warfield.png"
        bgColor="bg-slate-800"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
