import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { PostForm } from '@/features/posts/PostForm'
import { YEAR_CATEGORIES } from '@/lib/constants'

const BOARD_PATH = '/resources/pastoral'


interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: '글 수정 — 목회자료실' }

export default async function EditPastoralPostPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=${BOARD_PATH}/${id}/edit`)

  const { data: post } = await supabase.from('posts').select('*').eq('id', id).single()

  if (!post || post.user_id !== user.id) return notFound()

  const [{ data: postImages }, { data: postAttachments }] = await Promise.all([
    supabase.from('post_images').select('id, url').eq('post_id', id).order('display_order'),
    supabase.from('post_attachments').select('id, file_name, file_url, file_size').eq('post_id', id),
  ])

  return (
    <>
      <PageHeader
        title="글 수정"
        breadcrumbs={[
          { label: '마스터스자료실', href: '/resources' },
          { label: '목회자료실', href: BOARD_PATH },
          { label: post.title, href: `${BOARD_PATH}/${id}` },
          { label: '수정' },
        ]}
        backgroundImage="/images/breadcrumb/bb_warfield.png"
        bgColor="bg-slate-800"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostForm
          mode="edit"
          postId={id}
          boardPath={BOARD_PATH}
          categories={YEAR_CATEGORIES}
          initialValues={{
            title: post.title,
            category: post.category,
            content: post.content ?? '',
            youtube_url: post.youtube_url,
          }}
          cancelHref={`${BOARD_PATH}/${id}`}
          initialImages={postImages ?? []}
          initialAttachments={postAttachments ?? []}
        />
      </div>
    </>
  )
}
