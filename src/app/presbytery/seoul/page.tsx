import { PageHeader } from '@/components/shared/PageHeader'
import { ComingSoon } from '@/components/shared/ComingSoon'

export const metadata = { title: '서울' }

export default function PresbyterSeoulPage() {
  return (
    <>
      <PageHeader
        title="서울"
        breadcrumbs={[{ label: '노회소개', href: '/presbytery' }, { label: '서울' }]}
        backgroundImage="/images/breadcrumb/john_knox.jpg"
        bgColor="bg-slate-800"
      />
      <ComingSoon />
    </>
  )
}
