import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { PostForm } from '@/features/posts/PostForm'
import { getIsAdmin } from '@/lib/admin'

export const metadata = { title: '글쓰기 — 클럽소식' }

export default async function NewClubNewsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/club-news/news/new')

  const isAdmin = await getIsAdmin()

  return (
    <>
      <PageHeader
        title="글쓰기"
        breadcrumbs={[
          { label: '클럽소식', href: '/club-news' },
          { label: '소식', href: '/club-news/news' },
          { label: '글쓰기' },
        ]}
        backgroundImage="/images/breadcrumb/john_knox.jpg"
        bgColor="bg-slate-800"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostForm
          mode="create"
          board="club-news"
          boardPath="/club-news/news"
          pinOnly
          isAdmin={isAdmin}
          cancelHref="/club-news/news"
        />
      </div>
    </>
  )
}
