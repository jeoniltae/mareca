// 최더함의 철학시가 목록 페이지 — 다크 잉크 네이비 에디토리얼 톤의 영상 아카이브

import type { Metadata } from 'next'
import { Link } from 'next-view-transitions'
import { PenSquare, Play } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { formatYMD } from '@/lib/date'
import { OG_IMAGE } from '@/lib/constants'
import { extractYoutubeId, getYoutubeThumbnail } from '@/features/youtube/youtube-utils'
import { PhilosophiaHero } from '@/features/philosophia/PhilosophiaHero'
import { PhilosophiaPagination } from '@/features/philosophia/PhilosophiaPagination'
import { batang, plexMono } from '@/features/philosophia/fonts'

const DESCRIPTION = '시를 AI가 만든 곡조와 함께 듣고 읽는 새로운 장르, 최더함 목사의 철학시가입니다.'

export const metadata: Metadata = {
  title: '최더함의 철학시가',
  description: DESCRIPTION,
  openGraph: {
    title: '최더함의 철학시가',
    description: DESCRIPTION,
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/community/philosophia`,
    images: [OG_IMAGE],
  },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/community/philosophia` },
}

const BASE_PATH = '/community/philosophia'
const PAGE_SIZE = 12

const CATEGORIES = ['전체', '일반', '숏츠'] as const

// Tailwind는 동적으로 조합한 클래스명을 스캔하지 못하므로 지연값을 정적 문자열로 나열한다. PAGE_SIZE와 개수를 맞춘다
const STAGGER = [
  '[animation-delay:0ms]',
  '[animation-delay:70ms]',
  '[animation-delay:140ms]',
  '[animation-delay:210ms]',
  '[animation-delay:280ms]',
  '[animation-delay:350ms]',
  '[animation-delay:420ms]',
  '[animation-delay:490ms]',
  '[animation-delay:560ms]',
  '[animation-delay:630ms]',
  '[animation-delay:700ms]',
  '[animation-delay:770ms]',
]

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>
}

export default async function PhilosophiaPage({ searchParams }: Props) {
  const { page: pageParam, category: categoryParam } = await searchParams
  const page = Math.max(1, Number(pageParam ?? 1) || 1)
  const category = CATEGORIES.includes(categoryParam as (typeof CATEGORIES)[number])
    ? (categoryParam as (typeof CATEGORIES)[number])
    : '전체'

  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  let query = supabase
    .from('posts')
    .select('id, title, youtube_url, views, created_at, category', { count: 'exact' })
    .eq('board', 'philosophia')
    .order('created_at', { ascending: false })
    .range(from, to)

  if (category !== '전체') query = query.eq('category', category)

  const [
    { data: { user } },
    { data: posts, count },
  ] = await Promise.all([supabase.auth.getUser(), query])

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)
  const listPath = category === '전체' ? BASE_PATH : `${BASE_PATH}?category=${category}`

  return (
    <div className="bg-[#14243F]">
      <PhilosophiaHero
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: '최더함의 철학시가' },
        ]}
      />

      <section className="relative">
        {/* 도트 그리드 질감 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(rgba(237,231,214,0.07)_1px,transparent_1px)] bg-size-[22px_22px]"
        />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          {/* 툴바 — 모바일은 [탭 … 등록] 한 줄 + 그 아래 ENTRIES, sm 이상은 [탭 ENTRIES … 등록] 한 줄.
              order와 w-full로 순서를 바꿔 버튼 마크업을 중복시키지 않는다 */}
          <div className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={cat === '전체' ? BASE_PATH : `${BASE_PATH}?category=${cat}`}
                className={`text-base transition-colors ${
                  category === cat
                    ? 'text-[#EDE7D6] underline decoration-[#D9B441] decoration-2 underline-offset-8'
                    : 'text-[#EDE7D6]/50 hover:text-[#EDE7D6]/85'
                }`}
              >
                {cat}
              </Link>
            ))}

            <span
              className={`${plexMono.className} order-1 w-full text-[13px] tracking-[0.18em] text-[#EDE7D6]/45 sm:order-0 sm:w-auto`}
            >
              {String(count ?? 0).padStart(3, '0')} ENTRIES
            </span>

            {user && (
              <Link
                href={`${BASE_PATH}/new`}
                className={`${plexMono.className} ml-auto flex items-center gap-2 rounded-full border border-[#D9B441]/70 px-6 py-2.5 text-[14px] tracking-[0.08em] text-[#D9B441] transition-colors hover:bg-[#D9B441] hover:text-[#14243F] sm:order-1`}
              >
                <PenSquare size={15} />
                영상 등록
              </Link>
            )}
          </div>

          {/* 그리드 — 컨테이너가 위·왼쪽, 각 셀이 아래·오른쪽 헤어라인을 그려 격자를 완성한다 */}
          {(posts?.length ?? 0) === 0 ? (
            <p className={`${plexMono.className} py-24 text-center text-[14px] tracking-[0.16em] text-[#EDE7D6]/45`}>
              NO ENTRIES
            </p>
          ) : (
            <div className="grid grid-cols-1 border-t border-l border-[#EDE7D6]/15 sm:grid-cols-2 xl:grid-cols-4">
              {posts?.map((post, i) => {
                const videoId = post.youtube_url ? extractYoutubeId(post.youtube_url) : null
                const thumbnail = videoId ? getYoutubeThumbnail(videoId) : null

                return (
                  <Link
                    key={post.id}
                    href={`${BASE_PATH}/${post.id}`}
                    className={`group animate-in fade-in slide-in-from-bottom-3 relative flex flex-col gap-6 border-r border-b border-[#EDE7D6]/15 p-6 transition-colors duration-300 animation-duration-[600ms] fill-mode-[backwards] hover:bg-[#20365E] ${STAGGER[i % STAGGER.length]}`}
                  >
                    {/* 호버 시 좌측에서 자라나는 골드 룰 */}
                    <span
                      aria-hidden
                      className="absolute top-0 left-0 h-px w-0 bg-[#D9B441] transition-[width] duration-500 ease-out group-hover:w-full"
                    />

                    {/* 넘버링 — 페이지가 넘어가도 이어지도록 from을 더한다 */}
                    <span
                      className={`${plexMono.className} text-3xl leading-none text-[#EDE7D6]/35 transition-colors duration-300 group-hover:text-[#D9B441]/70`}
                    >
                      {String(from + i + 1).padStart(2, '0')}
                    </span>

                    {/* 썸네일 — 유튜브 ID를 못 뽑으면 오선 패턴 플레이스홀더로 대체한다 */}
                    <div className="relative aspect-video overflow-hidden border border-[#EDE7D6]/15 bg-[#101D34]">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={post.title}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover opacity-90 transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
                        />
                      ) : (
                        <div
                          aria-hidden
                          className="absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_6px,rgba(237,231,214,0.13)_6px,rgba(237,231,214,0.13)_7px)]"
                        />
                      )}
                      {/* 밝은 썸네일 위에서도 재생 아이콘이 읽히도록 얇은 스크림을 깐다 */}
                      <div className="absolute inset-0 flex items-center justify-center bg-[#101D34]/30 transition-colors duration-300 group-hover:bg-[#101D34]/10">
                        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#EDE7D6]/50 transition-all duration-300 group-hover:scale-110 group-hover:border-[#D9B441] group-hover:bg-[#D9B441]/10">
                          <Play
                            size={15}
                            className="ml-0.5 fill-[#EDE7D6] text-[#EDE7D6] transition-colors group-hover:fill-[#D9B441] group-hover:text-[#D9B441]"
                          />
                        </span>
                      </div>
                    </div>

                    {/* 제목 + 메타 */}
                    <div className="flex flex-1 flex-col justify-between gap-6">
                      <h2
                        className={`${batang.className} line-clamp-2 text-lg leading-snug text-[#EDE7D6] transition-colors duration-300 group-hover:text-[#D9B441]`}
                      >
                        {post.title}
                      </h2>
                      <div
                        className={`${plexMono.className} flex items-center gap-5 text-[13px] tracking-[0.08em] text-[#EDE7D6]/50`}
                      >
                        <span>{formatYMD(post.created_at)}</span>
                        <span>{post.views}</span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}

          <PhilosophiaPagination currentPage={page} totalPages={totalPages} basePath={listPath} />
        </div>
      </section>
    </div>
  )
}
