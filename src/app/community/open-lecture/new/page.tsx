// 마스터스 오픈강좌 새 글 작성 페이지
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { OpenLectureForm } from '@/features/open-lecture/OpenLectureForm'
import { getIsAdmin } from '@/lib/admin'

export const metadata = { title: '강좌 등록 — 마스터스 오픈강좌' }

export default async function NewOpenLecturePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/community/open-lecture/new')

  const isAdmin = await getIsAdmin()

  return (
    <>
      <PageHeader
        title="강좌 등록"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: '마스터스 오픈강좌', href: '/community/open-lecture' },
          { label: '강좌 등록' },
        ]}
        backgroundImage="/images/breadcrumb/monument.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 10%"
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OpenLectureForm
          mode="create"
          isAdmin={isAdmin}
          cancelHref="/community/open-lecture"
        />
      </div>
    </>
  )
}
