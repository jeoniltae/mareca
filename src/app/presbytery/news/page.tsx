import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '노회소식' }

export default function PresbyterNewsPage() {
  return (
    <>
      <PageHeader
        title="노회소식"
        breadcrumbs={[{ label: '노회소개', href: '/presbytery' }, { label: '노회소식' }]}
        backgroundImage="/images/john_knox.jpg"
        bgColor="bg-slate-800"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
