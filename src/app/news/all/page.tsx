import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '소식' }

export default function NewsAllPage() {
  return (
    <>
      <PageHeader
        title="소식"
        breadcrumbs={[{ label: '소식', href: '/news' }, { label: '소식' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
