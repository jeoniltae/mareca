import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { PostForm } from '@/features/posts/PostForm'

export const metadata = { title: '글쓰기 — 마스터스 메시지' }

const MESSAGE_CATEGORIES = ['공지', '일반'] as const

export default async function NewMessagePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/community/message/new')

  return (
    <>
      <PageHeader
        title="글쓰기"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: '마스터스 메시지', href: '/community/message' },
          { label: '글쓰기' },
        ]}
        backgroundImage="/images/breadcrumb/monument.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 10%"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostForm
          mode="create"
          board="message"
          boardPath="/community/message"
          categories={MESSAGE_CATEGORIES}
          cancelHref="/community/message"
        />
      </div>
    </>
  )
}
