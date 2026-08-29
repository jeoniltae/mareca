// 최더함의 철학시가 상세 페이지 — 다크 잉크 네이비 톤. 유튜브 플레이어 + 설명 + 공유

import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { formatDateTimeVerbose } from '@/lib/date'
import { articleJsonLd } from '@/lib/json-ld'
import { getIsAdmin } from '@/lib/admin'
import { extractYoutubeId, getYoutubeThumbnail } from '@/features/youtube/youtube-utils'
import { YoutubePlayer } from '@/features/youtube/YoutubePlayer'
import { ViewTracker } from '@/features/posts/ViewTracker'
import { ShareButtons } from '@/components/shared/ShareButtons'
import { BackToListLink } from '@/components/shared/BackToListLink'
import { PhilosophiaHero } from '@/features/philosophia/PhilosophiaHero'
import { PhilosophiaActions } from '@/features/philosophia/PhilosophiaActions'
import { philosophiaDescription, philosophiaKeywords } from '@/features/philosophia/content-meta'
import { batang, plexMono } from '@/features/philosophia/fonts'
import { Calendar, Eye, User } from 'lucide-react'

const BASE_PATH = '/community/philosophia'
const BOARD = 'philosophia'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('title, content, youtube_url')
    .eq('id', id)
    .eq('board', BOARD)
    .single()

  const videoId = data?.youtube_url ? extractYoutubeId(data.youtube_url) : null
  const thumbnailUrl = videoId ? getYoutubeThumbnail(videoId) : '/images/logo.png'
  // 본문 앞부분은 전 글이 같은 소개문·CREDITS라 그대로 쓰면 description이 전부 중복된다
  const description = philosophiaDescription(data?.content, data?.title ?? '최더함의 철학시가')

  return {
    title: data?.title ?? '최더함의 철학시가',
    description,
    openGraph: {
      title: data?.title ?? '최더함의 철학시가',
      description,
      images: [{ url: thumbnailUrl, alt: data?.title ?? '최더함의 철학시가' }],
      type: 'article',
    },
    twitter: {
      card: videoId ? 'summary_large_image' : 'summary',
      title: data?.title ?? '최더함의 철학시가',
      description,
      images: [{ url: thumbnailUrl, alt: data?.title ?? '최더함의 철학시가' }],
    },
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}${BASE_PATH}/${id}` },
  }
}

export default async function PhilosophiaDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: post }, { data: { user } }, isAdmin] = await Promise.all([
    supabase
      .from('posts')
      .select('*, profiles(nickname)')
      .eq('id', id)
      .eq('board', BOARD)
      .single(),
    supabase.auth.getUser(),
    getIsAdmin(),
  ])

  if (!post) return notFound()

  const isAuthor = user?.id === post.user_id
  const videoId = post.youtube_url ? extractYoutubeId(post.youtube_url) : null
  const nickname = (post.profiles as { nickname: string | null } | null)?.nickname ?? '알 수 없음'

  return (
    <div className="bg-[#14243F]">
      <PhilosophiaHero
        variant="compact"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: '최더함의 철학시가', href: BASE_PATH },
          { label: post.title },
        ]}
      />

      <section className="relative">
        {/* 도트 그리드 질감 — 목록과 동일 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(237,231,214,0.07)_1px,transparent_1px)] bg-size-[22px_22px]"
        />

        <div className="relative mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {/* 제목 & 메타 */}
          <div className="border-b border-[#EDE7D6]/15 pb-6">
            <h1 className={`${batang.className} text-2xl leading-snug text-[#EDE7D6] sm:text-3xl`}>
              {post.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div
                className={`${plexMono.className} flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] tracking-[0.06em] text-[#EDE7D6]/50`}
              >
                <span className="flex items-center gap-1.5 text-[#EDE7D6]/80">
                  <User size={13} />
                  {nickname}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={13} />
                  {formatDateTimeVerbose(post.created_at)}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={13} />
                  {post.views}
                </span>
              </div>

              {(isAuthor || isAdmin) && <PhilosophiaActions id={id} />}
            </div>
          </div>

          {/* 유튜브 플레이어 — 공용 컴포넌트의 rounded-xl·shadow가 라운드 0 격자와 충돌해 감싸는 쪽에서 중화한다 */}
          {videoId ? (
            <div className="mt-10 border border-[#EDE7D6]/15 [&>div]:rounded-none [&>div]:shadow-none">
              <YoutubePlayer videoId={videoId} title={post.title} />
            </div>
          ) : post.youtube_url ? (
            <div className="mt-10 border border-[#EDE7D6]/15 bg-[#101D34] p-4">
              <a
                href={post.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${plexMono.className} text-[13px] break-all text-[#D9B441] hover:underline`}
              >
                {post.youtube_url}
              </a>
            </div>
          ) : null}

          {/* 설명 — 폼이 평문 textarea라 그대로 렌더한다 (HTML 주입 경로 없음) */}
          {post.content && (
            <div className="mt-10 text-[16px] leading-relaxed whitespace-pre-wrap text-[#EDE7D6]/80">
              {post.content}
            </div>
          )}

          {/* 공유 — ShareButtons는 className을 받지 않아, 라이트 톤인 '링크 복사' 버튼만 하위 선택자로 덮어쓴다.
              (카카오 버튼은 노란 배경이라 다크에서도 그대로 읽힌다) */}
          <div className="mt-12 border-t border-[#EDE7D6]/15 pt-8 [&_button:last-child]:border-[#EDE7D6]/25 [&_button:last-child]:text-[#EDE7D6]/80 [&_button:last-child]:hover:bg-[#EDE7D6]/10">
            <ShareButtons
              title={post.title}
              description={post.content ?? undefined}
              imageUrl={videoId ? getYoutubeThumbnail(videoId) : undefined}
            />
          </div>

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(
                articleJsonLd({
                  title: post.title,
                  description: philosophiaDescription(post.content, post.title),
                  keywords: philosophiaKeywords(post.content),
                  url: `${process.env.NEXT_PUBLIC_SITE_URL}${BASE_PATH}/${id}`,
                  datePublished: post.created_at ?? undefined,
                  dateModified: post.updated_at ?? undefined,
                  imageUrl: videoId ? getYoutubeThumbnail(videoId) : undefined,
                  authorName: (post.profiles as { nickname: string | null } | null)?.nickname ?? undefined,
                })
              ),
            }}
          />
          <ViewTracker id={id} boardPath={BASE_PATH} />

          <div className="mt-8">
            <BackToListLink
              fallbackHref={BASE_PATH}
              className={`${plexMono.className} text-[13px] tracking-[0.1em] text-[#EDE7D6]/50 transition-colors hover:text-[#D9B441]`}
            />
          </div>
        </div>
      </section>
    </div>
  )
}
