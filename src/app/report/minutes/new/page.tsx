import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { PostForm } from '@/features/posts/PostForm'
import { YEAR_CATEGORIES } from '@/lib/constants'

export const metadata = { title: '글쓰기 — 총회의사록' }

const BOARD = 'minutes'
const BOARD_PATH = '/report/minutes'

export default async function NewMinutesPostPage() {
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
          { label: '회의보고', href: '/report' },
          { label: '총회의사록', href: BOARD_PATH },
          { label: '글쓰기' },
        ]}
        backgroundImage="/images/breadcrumb/herman_bavinck.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 28%"
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
