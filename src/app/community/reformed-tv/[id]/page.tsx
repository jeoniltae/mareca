
import { createClient } from '@/lib/supabase-server'
import { formatDateTimeVerbose } from '@/lib/date'
import { articleJsonLd, toJsonLdHtml, youtubeVideoObjectJsonLd } from '@/lib/json-ld'
import { PageHeader } from '@/components/shared/PageHeader'
import { notFound } from 'next/navigation'
import { ViewTracker } from '@/features/posts/ViewTracker'
import { ReformedTVActions } from '@/features/reformed-tv/ReformedTVActions'
import { getIsAdmin } from '@/lib/admin'
import { extractYoutubeId, getYoutubeThumbnail } from '@/features/youtube/youtube-utils'
import { YoutubePlayer } from '@/features/youtube/YoutubePlayer'
import { shortsDescription } from '@/features/reformed-tv/content-meta'
import { extractHashtags } from '@/lib/hashtags'
import { ShareButtons } from '@/components/shared/ShareButtons'
import { BackToListLink } from '@/components/shared/BackToListLink'
import { Calendar, Eye, User } from 'lucide-react'
interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('posts').select('title, content, youtube_url, category').eq('id', id).eq('board', 'reformed-tv').single()
  const videoId = data?.youtube_url ? extractYoutubeId(data.youtube_url) : null
  const thumbnailUrl = videoId ? getYoutubeThumbnail(videoId) : '/images/logo.png'
  const rawText = data?.content?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() ?? ''
  // 숏츠만 제목+정리된 본문 — 같은 강의의 숏츠끼리 본문이 같아 description이 중복된다. 일반 영상은 기존 그대로
  const description =
    data?.category === '숏츠'
      ? shortsDescription(data.content, data.title)
      : rawText.slice(0, 120) || '마스터스개혁파총회 ReformedTV 영상입니다.'
  return {
    title: data?.title ?? 'ReformedTV',
    description,
    openGraph: {
      title: data?.title ?? 'ReformedTV',
      description,
      images: [{ url: thumbnailUrl, alt: data?.title ?? 'ReformedTV' }],
      type: 'article',
    },
    twitter: {
      card: videoId ? 'summary_large_image' : 'summary',
      title: data?.title ?? 'ReformedTV',
      description,
      images: [{ url: thumbnailUrl, alt: data?.title ?? 'ReformedTV' }],
    },
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/community/reformed-tv/${id}` },
  }
}

export default async function ReformedTVDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: post }, { data: { user } }, isAdmin] = await Promise.all([
    supabase
      .from('posts')
      .select('*, profiles(nickname)')
      .eq('id', id)
      .eq('board', 'reformed-tv')
      .single(),
    supabase.auth.getUser(),
    getIsAdmin(),
  ])

  if (!post) return notFound()

  const isAuthor = user?.id === post.user_id
  const videoId = post.youtube_url ? extractYoutubeId(post.youtube_url) : null

  const date = formatDateTimeVerbose(post.created_at)

  // 숏츠만 description·keywords를 새 규칙으로 — 일반 영상은 아래 각 자리의 기존 식을 그대로 쓴다
  const isShorts = post.category === '숏츠'
  const shortsDesc = isShorts ? shortsDescription(post.content, post.title) : null
  const keywords = isShorts ? extractHashtags(post.content) : undefined

  return (
    <>
      <PageHeader
        title="ReformedTV"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: 'ReformedTV', href: '/community/reformed-tv' },
          { label: post.title },
        ]}
        backgroundImage="/images/breadcrumb/monument.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 10%"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 제목 & 메타 */}
        <div className="mb-6 pb-5 border-b border-slate-200">
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 leading-snug">
            {post.title}
          </h1>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-700"><User size={13} />
                {(post.profiles as { nickname: string | null } | null)?.nickname ?? '알 수 없음'}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={13} />
                {date}
              </span>
              <span className="flex items-center gap-1">
                <Eye size={13} />
                {post.views}
              </span>
            </div>
            {(isAuthor || isAdmin) && <ReformedTVActions id={id} />}
          </div>
        </div>

        {/* 유튜브 플레이어 */}
        {videoId ? (
          <div className="mb-8">
            <YoutubePlayer videoId={videoId} title={post.title} />
          </div>
        ) : post.youtube_url ? (
          <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <a
              href={post.youtube_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-sky-600 hover:underline break-all"
            >
              {post.youtube_url}
            </a>
          </div>
        ) : null}

        {/* 설명 */}
        {post.content && (
          <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap mb-8">
            {post.content}
          </div>
        )}

        {/* 공유 */}
        <div className="pt-6 border-t border-slate-200">
          <ShareButtons
            title={post.title}
            description={shortsDesc ?? post.content ?? undefined}
            imageUrl={videoId ? getYoutubeThumbnail(videoId) : undefined}
          />
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: toJsonLdHtml(
              articleJsonLd({
                title: post.title,
                description: shortsDesc ?? post.content?.slice(0, 120) ?? '',
                keywords,
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/community/reformed-tv/${id}`,
                datePublished: post.created_at ?? undefined,
                dateModified: post.updated_at ?? undefined,
                imageUrl: videoId ? getYoutubeThumbnail(videoId) : undefined,
                authorName: (post.profiles as { nickname: string | null } | null)?.nickname ?? undefined,
              })
            ),
          }}
        />
        {videoId && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: toJsonLdHtml(
                youtubeVideoObjectJsonLd({
                  title: post.title,
                  description:
                    shortsDesc ?? post.content?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().slice(0, 120) ?? '',
                  keywords,
                  videoId,
                  thumbnailUrl: getYoutubeThumbnail(videoId),
                  uploadDate: post.created_at ?? undefined,
                })
              ),
            }}
          />
        )}
        <ViewTracker id={id} boardPath="/community/reformed-tv" />
        {/* 목록으로 */}
        <div className="mt-4">
          <BackToListLink
            fallbackHref="/community/reformed-tv"
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
          />
        </div>
      </div>
    </>
  )
}
