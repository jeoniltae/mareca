import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { PostForm } from '@/features/posts/PostForm'

export const metadata = { title: '글쓰기 — Plus Voice' }

const VOICE_CATEGORIES = ['공지', '일반'] as const

export default async function NewVoicePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/community/voice/new')

  return (
    <>
      <PageHeader
        title="글쓰기"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: 'Plus Voice', href: '/community/voice' },
          { label: '글쓰기' },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostForm
          mode="create"
          board="voice"
          boardPath="/community/voice"
          categories={VOICE_CATEGORIES}
          cancelHref="/community/voice"
        />
      </div>
    </>
  )
}
