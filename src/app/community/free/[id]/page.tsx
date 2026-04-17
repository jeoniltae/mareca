import { createClient } from '@/lib/supabase-server'
import { PageHeader } from '@/components/shared/PageHeader'
import { notFound } from 'next/navigation'
import { incrementViews } from '@/features/posts/actions'
import { PostActions } from '@/features/posts/PostActions'
import { Eye, Calendar, Tag } from 'lucide-react'
import Link from 'next/link'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('posts').select('title').eq('id', id).single()
  return { title: data?.title ?? '게시글' }
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: post }, { data: { user } }] = await Promise.all([
    supabase
      .from('posts')
      .select('*, profiles(nickname)')
      .eq('id', id)
      .single(),
    supabase.auth.getUser(),
  ])

  if (!post) return notFound()

  // 조회수 증가 (비동기, 결과 무시)
  incrementViews(id)

  const isAuthor = user?.id === post.user_id
  const date = new Date(post.created_at).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <>
      <PageHeader
        title="자유게시판"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: '자유게시판', href: '/community/free' },
          { label: post.title },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 게시글 헤더 */}
        <div className="mb-6 pb-5 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-3 text-sm text-slate-500">
            <Tag size={13} />
            <span>{post.category}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 leading-snug">
            {post.title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="font-medium text-slate-700">
                {(post.profiles as { nickname: string | null } | null)?.nickname ?? '알 수 없음'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {date}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={13} />
                {post.views + 1}
              </span>
            </div>

            {isAuthor && <PostActions id={id} />}
          </div>
        </div>

        {/* 본문 */}
        <div
          className="prose prose-slate max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
        />

        {/* 유튜브 링크 */}
        {post.youtube_url && (
          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm font-medium text-slate-700 mb-2">첨부 영상</p>
            <a
              href={post.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-sky-600 hover:underline break-all"
            >
              {post.youtube_url}
            </a>
          </div>
        )}

        {/* 목록으로 */}
        <div className="mt-10 pt-6 border-t border-slate-200">
          <Link
            href="/community/free"
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← 목록으로
          </Link>
        </div>
      </div>
    </>
  )
}
