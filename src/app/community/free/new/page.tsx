import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { PostForm } from '@/features/posts/PostForm'

export const metadata = { title: '글쓰기 — 자유게시판' }

export default async function NewPostPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/community/free/new')

  return (
    <>
      <PageHeader
        title="글쓰기"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: '자유게시판', href: '/community/free' },
          { label: '글쓰기' },
        ]}
        backgroundImage="/images/breadcrumb/monument.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 10%"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostForm mode="create" categories={['공지', '일반', '질문', '나눔']} cancelHref="/community/free" />
      </div>
    </>
  )
}
