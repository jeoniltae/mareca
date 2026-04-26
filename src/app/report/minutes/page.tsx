import { PageHeader } from '@/components/shared/PageHeader'
import { ComingSoon } from '@/components/shared/ComingSoon'

export const metadata = { title: '총회의사록' }

export default function ReportMinutesPage() {
  return (
    <>
      <PageHeader
        title="총회의사록"
        breadcrumbs={[{ label: '회의보고', href: '/report' }, { label: '총회의사록' }]}
        backgroundImage="/images/breadcrumb/herman_bavinck.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 28%"
      />
      <ComingSoon />
    </>
  )
}
