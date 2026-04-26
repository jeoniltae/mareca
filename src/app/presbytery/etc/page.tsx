import { PageHeader } from '@/components/shared/PageHeader'
import { ComingSoon } from '@/components/shared/ComingSoon'

export const metadata = { title: '기타' }

export default function PresbyterEtcPage() {
  return (
    <>
      <PageHeader
        title="기타"
        breadcrumbs={[{ label: '노회소개', href: '/presbytery' }, { label: '기타' }]}
        backgroundImage="/images/breadcrumb/john_knox.jpg"
        bgColor="bg-slate-800"
      />
      <ComingSoon />
    </>
  )
}
