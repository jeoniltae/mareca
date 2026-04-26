import { PageHeader } from '@/components/shared/PageHeader'
import { ComingSoon } from '@/components/shared/ComingSoon'

export const metadata = { title: '목회자료실' }

export default function ResourcesPastoralPage() {
  return (
    <>
      <PageHeader
        title="목회자료실"
        breadcrumbs={[{ label: '마스터스자료실', href: '/resources' }, { label: '목회자료실' }]}
        backgroundImage="/images/bb_warfield.png"
        bgColor="bg-slate-800"
      />
      <ComingSoon />
    </>
  )
}
