import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { GalleryForm } from '@/features/gallery/GalleryForm'

export const metadata = { title: '갤러리 글쓰기' }

export default async function GalleryNewPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <>
      <PageHeader
        title="갤러리 글쓰기"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: '갤러리', href: '/community/gallery' },
          { label: '글쓰기' },
        ]}
        backgroundImage="/images/breadcrumb/monument.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 10%"
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GalleryForm mode="create" />
      </div>
    </>
  )
}
