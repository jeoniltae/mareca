import { PageHeader } from '@/components/shared/PageHeader'
import { ComingSoon } from '@/components/shared/ComingSoon'

export const metadata = { title: '제주' }

export default function PresbyterJejuPage() {
  return (
    <>
      <PageHeader
        title="제주"
        breadcrumbs={[{ label: '노회소개', href: '/presbytery' }, { label: '제주' }]}
        backgroundImage="/images/breadcrumb/john_knox.jpg"
        bgColor="bg-slate-800"
      />
      <ComingSoon />
    </>
  )
}
