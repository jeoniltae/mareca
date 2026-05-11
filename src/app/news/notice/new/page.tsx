import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { PostForm } from '@/features/posts/PostForm'
import { getIsAdmin } from '@/lib/admin'

export const metadata = { title: '글쓰기 — 공지사항' }

export default async function NewNoticePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/news/notice/new')

  const isAdmin = await getIsAdmin()

  return (
    <>
      <PageHeader
        title="글쓰기"
        breadcrumbs={[
          { label: '소식', href: '/news' },
          { label: '공지사항', href: '/news/notice' },
          { label: '글쓰기' },
        ]}
        backgroundImage="/images/breadcrumb/cornelius_vantil.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 26%"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostForm
          mode="create"
          board="notice"
          boardPath="/news/notice"
          pinOnly
          isAdmin={isAdmin}
          cancelHref="/news/notice"
        />
      </div>
    </>
  )
}
