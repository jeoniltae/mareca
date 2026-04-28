import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { PostForm } from '@/features/posts/PostForm'

export const metadata = { title: '글쓰기 — 교회계획' }

const BOARD = 'church-plan'
const BOARD_PATH = '/online-admin/plan'
const CATEGORIES = ['일반'] as const

export default async function NewPlanPostPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=${BOARD_PATH}/new`)

  return (
    <>
      <PageHeader
        title="글쓰기"
        breadcrumbs={[
          { label: '온라인행정', href: '/online-admin' },
          { label: '교회계획', href: BOARD_PATH },
          { label: '글쓰기' },
        ]}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostForm
          mode="create"
          board={BOARD}
          boardPath={BOARD_PATH}
          categories={CATEGORIES}
          cancelHref={BOARD_PATH}
        />
      </div>
    </>
  )
}
