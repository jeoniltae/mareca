import { PageHeader } from '@/components/shared/PageHeader'
import { ComingSoon } from '@/components/shared/ComingSoon'

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
      <ComingSoon />
    </>
  )
}
