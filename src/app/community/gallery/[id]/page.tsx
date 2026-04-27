import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { GalleryImageViewer } from '@/features/gallery/GalleryImageViewer'
import { GalleryActions } from '@/features/gallery/GalleryActions'
import { ShareButtons } from '@/components/shared/ShareButtons'
import { incrementGalleryViews } from '@/features/gallery/actions'
import { Eye } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: post }, { data: firstImage }] = await Promise.all([
    supabase.from('posts').select('title, content').eq('id', id).single(),
    supabase.from('post_images').select('url').eq('post_id', id).order('display_order').limit(1).single(),
  ])
  return {
    title: post?.title ?? '갤러리',
    openGraph: {
      title: post?.title ?? '갤러리',
      description: post?.content ?? '',
      images: firstImage?.url ? [{ url: firstImage.url }] : [{ url: '/images/logo.jpg' }],
    },
  }
}

export default async function GalleryDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: post } = await supabase
    .from('posts')
    .select('id, user_id, title, content, views, created_at, profiles(nickname)')
    .eq('id', id)
    .eq('board', 'gallery')
    .single()

  if (!post) notFound()

  incrementGalleryViews(id)

  const { data: images } = await supabase
    .from('post_images')
    .select('url')
    .eq('post_id', id)
    .order('display_order', { ascending: true })

  const imageUrls = (images ?? []).map((img) => img.url)

  const formatted = new Date(post.created_at ?? '').toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
  const nickname = (post.profiles as { nickname: string | null } | null)?.nickname ?? '알 수 없음'
  const isOwner = user?.id === post.user_id

  return (
    <>
      <PageHeader
        title="갤러리"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: '갤러리', href: '/community/gallery' },
          { label: post.title },
        ]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 제목 & 메타 */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900 mb-2">{post.title}</h1>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span>{nickname}</span>
              <span>{formatted}</span>
              <span className="flex items-center gap-1">
                <Eye size={13} />
                {post.views + 1}
              </span>
            </div>
            {isOwner && <GalleryActions id={id} />}
          </div>
        </div>

        {/* 이미지 그리드 + 라이트박스 */}
        <GalleryImageViewer images={imageUrls} />

        {/* 설명 */}
        {post.content && (
          <div className="mt-6 p-5 bg-slate-50 rounded-xl">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
          </div>
        )}

        {/* 공유 */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <ShareButtons title={post.title} imageUrl={imageUrls[0]} />
        </div>

        {/* 목록으로 */}
        <div className="mt-4">
          <a
            href="/community/gallery"
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            ← 목록으로
          </a>
        </div>
      </div>
    </>
  )
}
