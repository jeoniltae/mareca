import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { PostForm } from '@/features/posts/PostForm'

export const metadata = { title: '글쓰기 — 소식' }

const NEWS_CATEGORIES = ['공지', '일반'] as const

export default async function NewNewsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/news/all/new')

  return (
    <>
      <PageHeader
        title="글쓰기"
        breadcrumbs={[
          { label: '소식', href: '/news' },
          { label: '소식', href: '/news/all' },
          { label: '글쓰기' },
        ]}
        backgroundImage="/images/breadcrumb/cornelius_vantil.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 26%"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostForm
          mode="create"
          board="news"
          boardPath="/news/all"
          categories={NEWS_CATEGORIES}
          cancelHref="/news/all"
        />
      </div>
    </>
  )
}
