import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '왜 마스터스개혁파총회를 시작하는가?' }

export default function AboutReasonPage() {
  return (
    <>
      <PageHeader
        title="왜 마스터스개혁파총회를 시작하는가?"
        breadcrumbs={[{ label: '총회소개', href: '/about' }, { label: '왜 마스터스개혁파총회를 시작하는가?' }]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-slate-500">준비중</p>
      </div>
    </>
  )
}
