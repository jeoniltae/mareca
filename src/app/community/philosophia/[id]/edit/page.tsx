// 최더함의 철학시가 수정 페이지 — 작성자 본인 또는 관리자만 접근 가능

import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { PhilosophiaForm } from '@/features/philosophia/PhilosophiaForm'
import { getIsAdmin } from '@/lib/admin'

const BASE_PATH = '/community/philosophia'
const BOARD = 'philosophia'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: '영상 수정 — 최더함의 철학시가' }

export default async function EditPhilosophiaPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=${BASE_PATH}/${id}/edit`)

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .eq('board', BOARD)
    .single()

  const isAdmin = await getIsAdmin()
  if (!post || (!isAdmin && post.user_id !== user.id)) return notFound()

  return (
    <>
      <PageHeader
        title="영상 수정"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: '최더함의 철학시가', href: BASE_PATH },
          { label: post.title, href: `${BASE_PATH}/${id}` },
          { label: '수정' },
        ]}
        bgColor="bg-[#182B4E]"
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PhilosophiaForm
          mode="edit"
          postId={id}
          initialValues={{
            title: post.title,
            youtube_url: post.youtube_url,
            description: post.content,
            category: post.category,
          }}
          cancelHref={`${BASE_PATH}/${id}`}
        />
      </div>
    </>
  )
}
