import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { ReformedTVForm } from '@/features/reformed-tv/ReformedTVForm'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: '영상 수정 — ReformedTV' }

export default async function EditReformedTVPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=/community/reformed-tv/${id}/edit`)

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .eq('board', 'reformed-tv')
    .single()

  if (!post || post.user_id !== user.id) return notFound()

  return (
    <>
      <PageHeader
        title="영상 수정"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: 'ReformedTV', href: '/community/reformed-tv' },
          { label: post.title, href: `/community/reformed-tv/${id}` },
          { label: '수정' },
        ]}
        backgroundImage="/images/breadcrumb/monument.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 10%"
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ReformedTVForm
          mode="edit"
          postId={id}
          initialValues={{
            title: post.title,
            youtube_url: post.youtube_url,
            description: post.content,
          }}
          cancelHref={`/community/reformed-tv/${id}`}
        />
      </div>
    </>
  )
}
