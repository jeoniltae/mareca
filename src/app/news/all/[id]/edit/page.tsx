import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { PostForm } from '@/features/posts/PostForm'
import { getIsAdmin } from '@/lib/admin'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: '글 수정 — 소식' }

export default async function EditNewsPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=/news/all/${id}/edit`)

  const [{ data: post }, isAdmin] = await Promise.all([
    supabase.from('posts').select('*').eq('id', id).single(),
    getIsAdmin(),
  ])

  if (!post || (!isAdmin && post.user_id !== user.id)) return notFound()

  const [{ data: postImages }, { data: postAttachments }] = await Promise.all([
    supabase.from('post_images').select('id, url').eq('post_id', id).order('display_order'),
    supabase.from('post_attachments').select('id, file_name, file_url, file_size').eq('post_id', id),
  ])

  return (
    <>
      <PageHeader
        title="글 수정"
        breadcrumbs={[
          { label: '소식', href: '/news' },
          { label: '소식', href: '/news/all' },
          { label: post.title, href: `/news/all/${id}` },
          { label: '수정' },
        ]}
        backgroundImage="/images/breadcrumb/cornelius_vantil.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 26%"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PostForm
          mode="edit"
          postId={id}
          board="news"
          boardPath="/news/all"
          pinOnly
          isAdmin={isAdmin}
          initialValues={{
            title: post.title,
            category: post.category,
            content: post.content ?? '',
            youtube_url: post.youtube_url,
          }}
          cancelHref={`/news/all/${id}`}
          initialImages={postImages ?? []}
          initialAttachments={postAttachments ?? []}
        />
      </div>
    </>
  )
}
