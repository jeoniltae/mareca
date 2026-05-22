// 마스터스 오픈강좌 상세 페이지 — 유튜브 또는 기사 OG 미리보기 표시
import { createClient } from '@/lib/supabase-server'
import { formatDateTimeVerbose } from '@/lib/date'
import { articleJsonLd } from '@/lib/json-ld'
import { PageHeader } from '@/components/shared/PageHeader'
import { notFound } from 'next/navigation'
import { ViewTracker } from '@/features/posts/ViewTracker'
import { OpenLectureActions } from '@/features/open-lecture/OpenLectureActions'
import { getIsAdmin } from '@/lib/admin'
import { extractYoutubeId, getYoutubeThumbnail } from '@/features/youtube/youtube-utils'
import { YoutubePlayer } from '@/features/reformed-tv/YoutubePlayer'
import { ShareButtons } from '@/components/shared/ShareButtons'
import { BackToListLink } from '@/components/shared/BackToListLink'
import { Calendar, Eye, User, MapPin, Clock, ExternalLink, Newspaper } from 'lucide-react'
import Image from 'next/image'

interface Props {
  params: Promise<{ id: string }>
}

interface OgData {
  title: string | null
  description: string | null
  image: string | null
}

async function fetchOgData(url: string): Promise<OgData> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 86400 },
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; mareca-bot/1.0)' },
    })
    if (!res.ok) return { title: null, description: null, image: null }
    const html = await res.text()

    const getMeta = (property: string) => {
      const match =
        html.match(new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i')) ??
        html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${property}["']`, 'i'))
      return match?.[1] ?? null
    }

    return {
      title: getMeta('og:title'),
      description: getMeta('og:description'),
      image: getMeta('og:image'),
    }
  } catch {
    return { title: null, description: null, image: null }
  }
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('title, content, youtube_url, article_url')
    .eq('id', id)
    .single()

  const videoId = data?.youtube_url ? extractYoutubeId(data.youtube_url) : null
  const thumbnailUrl = videoId ? getYoutubeThumbnail(videoId) : '/images/logo.png'
  const rawText = data?.content?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() ?? ''
  const description = rawText.slice(0, 120) || '마스터스개혁파총회 오픈강좌입니다.'

  return {
    title: data?.title ?? '마스터스 오픈강좌',
    description,
    openGraph: {
      title: data?.title ?? '마스터스 오픈강좌',
      description,
      images: [{ url: thumbnailUrl, alt: data?.title ?? '마스터스 오픈강좌' }],
      type: 'article',
    },
    twitter: {
      card: videoId ? 'summary_large_image' : 'summary',
      title: data?.title ?? '마스터스 오픈강좌',
      description,
      images: [{ url: thumbnailUrl, alt: data?.title ?? '마스터스 오픈강좌' }],
    },
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/community/open-lecture/${id}` },
  }
}

export default async function OpenLectureDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: post }, { data: { user } }, isAdmin] = await Promise.all([
    supabase
      .from('posts')
      .select('*, profiles(nickname)')
      .eq('id', id)
      .eq('board', 'open-lecture')
      .single(),
    supabase.auth.getUser(),
    getIsAdmin(),
  ])

  if (!post) return notFound()

  const isAuthor = user?.id === post.user_id
  const videoId = post.youtube_url ? extractYoutubeId(post.youtube_url) : null
  const showArticlePreview = !videoId && !!post.article_url

  // article_url이 있고 유튜브가 없을 때만 OG 데이터 fetch
  const ogData = showArticlePreview ? await fetchOgData(post.article_url!) : null

  const date = formatDateTimeVerbose(post.created_at)
  const isNotice = post.category === '공지'

  return (
    <>
      <PageHeader
        title="마스터스 오픈강좌"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: '마스터스 오픈강좌', href: '/community/open-lecture' },
          { label: post.title },
        ]}
        backgroundImage="/images/breadcrumb/monument.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 10%"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 제목 & 메타 */}
        <div className="mb-6 pb-5 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            {isNotice && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                공지
              </span>
            )}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 leading-snug">
            {post.title}
          </h1>

          {/* 강좌 일정 정보 */}
          {(post.event_date || post.location) && (
            <div className="flex flex-wrap gap-3 mb-4">
              {post.event_date && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 text-sm font-medium border border-sky-100">
                  <Calendar size={14} />
                  {post.event_date}
                </span>
              )}
              {post.event_time && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 text-sm font-medium border border-sky-100">
                  <Clock size={14} />
                  {post.event_time.slice(0, 5)}
                </span>
              )}
              {post.location && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-700 text-sm font-medium border border-slate-200">
                  <MapPin size={14} />
                  {post.location}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <User size={13} />
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
            {(isAuthor || isAdmin) && <OpenLectureActions id={id} />}
          </div>
        </div>

        {/* 유튜브 플레이어 */}
        {videoId && (
          <div className="mb-8">
            <YoutubePlayer videoId={videoId} title={post.title} />
          </div>
        )}

        {/* 기사 OG 미리보기 */}
        {showArticlePreview && (
          <div className="mb-8 rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm">
            {ogData?.image && (
              <div className="w-full bg-slate-100">
                <Image
                  src={ogData.image}
                  alt={ogData.title ?? '기사 이미지'}
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="w-full h-auto max-h-64 object-cover"
                  unoptimized
                />
              </div>
            )}
            {!ogData?.image && (
              <div className="w-full h-32 bg-slate-700 flex items-center justify-center">
                <Newspaper size={40} className="text-white/30" />
              </div>
            )}
            <div className="p-4">
              {ogData?.title && (
                <p className="text-base font-semibold text-slate-800 mb-1.5 leading-snug">
                  {ogData.title}
                </p>
              )}
              {ogData?.description && (
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
                  {ogData.description}
                </p>
              )}
              <a
                href={post.article_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-lg border-2 border-slate-800 text-slate-800 text-sm font-semibold hover:bg-slate-800 hover:text-white transition-colors"
              >
                <ExternalLink size={15} />
                원문 기사 보기
              </a>
            </div>
          </div>
        )}

        {/* 본문 */}
        {post.content && (
          <div className="mb-8">
            {isNotice ? (
              <div
                className="prose prose-slate max-w-none text-sm"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            ) : (
              <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </div>
            )}
          </div>
        )}

        {/* 공유 */}
        <div className="pt-6 border-t border-slate-200">
          <ShareButtons
            title={post.title}
            description={post.content?.replace(/<[^>]+>/g, '').slice(0, 120) ?? undefined}
            imageUrl={videoId ? getYoutubeThumbnail(videoId) : undefined}
          />
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              articleJsonLd({
                title: post.title,
                description: post.content?.replace(/<[^>]+>/g, '').slice(0, 120) ?? '',
                url: `${process.env.NEXT_PUBLIC_SITE_URL}/community/open-lecture/${id}`,
                datePublished: post.created_at ?? undefined,
                dateModified: post.updated_at ?? undefined,
                imageUrl: videoId ? getYoutubeThumbnail(videoId) : undefined,
              })
            ),
          }}
        />

        <ViewTracker id={id} boardPath="/community/open-lecture" />

        <div className="mt-4">
          <BackToListLink
            fallbackHref="/community/open-lecture"
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
          />
        </div>
      </div>
    </>
  )
}
