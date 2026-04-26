import { PageHeader } from '@/components/shared/PageHeader'
import { ComingSoon } from '@/components/shared/ComingSoon'

export const metadata = { title: '노회소식' }

export default function PresbyterNewsPage() {
  return (
    <>
      <PageHeader
        title="노회소식"
        breadcrumbs={[{ label: '노회소개', href: '/presbytery' }, { label: '노회소식' }]}
        backgroundImage="/images/breadcrumb/john_knox.jpg"
        bgColor="bg-slate-800"
      />
      <ComingSoon />
    </>
  )
}
