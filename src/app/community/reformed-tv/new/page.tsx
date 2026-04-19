import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { ReformedTVForm } from '@/features/reformed-tv/ReformedTVForm'

export const metadata = { title: '영상 등록 — ReformedTV' }

export default async function NewReformedTVPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/community/reformed-tv/new')

  return (
    <>
      <PageHeader
        title="영상 등록"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: 'ReformedTV', href: '/community/reformed-tv' },
          { label: '영상 등록' },
        ]}
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReformedTVForm mode="create" cancelHref="/community/reformed-tv" />
      </div>
    </>
  )
}
