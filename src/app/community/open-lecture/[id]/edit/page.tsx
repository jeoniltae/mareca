// 마스터스 오픈강좌 수정 페이지
import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { OpenLectureForm } from '@/features/open-lecture/OpenLectureForm'
import { getIsAdmin } from '@/lib/admin'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: '강좌 수정 — 마스터스 오픈강좌' }

export default async function EditOpenLecturePage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=/community/open-lecture/${id}/edit`)

  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .eq('board', 'open-lecture')
    .single()

  const isAdmin = await getIsAdmin()
  if (!post || (!isAdmin && post.user_id !== user.id)) return notFound()

  return (
    <>
      <PageHeader
        title="강좌 수정"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: '마스터스 오픈강좌', href: '/community/open-lecture' },
          { label: post.title, href: `/community/open-lecture/${id}` },
          { label: '수정' },
        ]}
        backgroundImage="/images/breadcrumb/monument.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 10%"
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <OpenLectureForm
          mode="edit"
          postId={id}
          isAdmin={isAdmin}
          initialValues={{
            title: post.title,
            category: post.category,
            location: post.location ?? null,
            event_date: post.event_date ?? null,
            event_time: post.event_time ?? null,
            content: post.content,
            youtube_url: post.youtube_url,
            article_url: post.article_url ?? null,
          }}
          cancelHref={`/community/open-lecture/${id}`}
        />
      </div>
    </>
  )
}
