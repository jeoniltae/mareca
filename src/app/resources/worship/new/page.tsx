import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { PostForm } from '@/features/posts/PostForm'
import { YEAR_CATEGORIES } from '@/lib/constants'

export const metadata = { title: '글쓰기 — 예배자료실' }

const BOARD = 'worship'
const BOARD_PATH = '/resources/worship'


export default async function NewWorshipPostPage() {
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
          { label: '마스터스자료실', href: '/resources' },
          { label: '예배자료실', href: BOARD_PATH },
          { label: '글쓰기' },
        ]}
        backgroundImage="/images/breadcrumb/bb_warfield.png"
        bgColor="bg-slate-800"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostForm
          mode="create"
          board={BOARD}
          boardPath={BOARD_PATH}
          categories={YEAR_CATEGORIES}
          cancelHref={BOARD_PATH}
        />
      </div>
    </>
  )
}
