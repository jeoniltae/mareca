// 마스터스 오픈강좌 목록 페이지 — 공지 상단 고정 리스트 + 일반 썸네일 그리드
import { createClient } from '@/lib/supabase-server'
import { formatYMD } from '@/lib/date'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { extractYoutubeId, getYoutubeThumbnail } from '@/features/youtube/youtube-utils'
import { PenSquare, Play, MapPin, Calendar, Eye, Pin } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '마스터스 오픈강좌',
  description: '마스터스개혁파총회가 주관하는 오픈강좌 영상과 일정을 확인하세요.',
  openGraph: {
    title: '마스터스 오픈강좌',
    description: '마스터스개혁파총회가 주관하는 오픈강좌 영상과 일정을 확인하세요.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/community/open-lecture`,
  },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/community/open-lecture` },
}

const PAGE_SIZE = 12

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function OpenLecturePage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam ?? 1) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  const [
    { data: { user } },
    { data: notices },
    { data: posts, count },
  ] = await Promise.all([
    supabase.auth.getUser(),
    // 공지 최대 5개 상단 고정
    supabase
      .from('posts')
      .select('id, title, created_at, event_date')
      .eq('board', 'open-lecture')
      .eq('category', '공지')
      .order('created_at', { ascending: false })
      .limit(5),
    // 일반 게시물 그리드
    supabase
      .from('posts')
      .select('id, title, youtube_url, article_url, views, created_at, event_date, event_time, location', { count: 'exact' })
      .eq('board', 'open-lecture')
      .eq('category', '일반')
      .order('created_at', { ascending: false })
      .range(from, to),
  ])

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <>
      <PageHeader
        title="마스터스 오픈강좌"
        breadcrumbs={[
          { label: '커뮤니티', href: '/community' },
          { label: '마스터스 오픈강좌' },
        ]}
        backgroundImage="/images/breadcrumb/monument.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 10%"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 툴바 */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            총 <strong className="text-slate-800">{(count ?? 0) + (notices?.length ?? 0)}</strong>개의 강좌
          </p>
          {user && (
            <Link
              href="/community/open-lecture/new"
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors"
            >
              <PenSquare size={14} />
              강좌 등록
            </Link>
          )}
        </div>

        {/* 공지 고정 리스트 */}
        {(notices?.length ?? 0) > 0 && (
          <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 overflow-hidden">
            {notices?.map((notice) => (
              <Link
                key={notice.id}
                href={`/community/open-lecture/${notice.id}`}
                className="flex items-center gap-3 px-4 py-3 border-b border-amber-100 last:border-b-0 hover:bg-amber-100 transition-colors"
              >
                <Pin size={14} className="text-amber-500 shrink-0" />
                <span className="text-sm font-medium text-slate-800 flex-1 truncate">
                  {notice.title}
                </span>
                <span className="text-xs text-slate-400 shrink-0">
                  {notice.event_date ?? formatYMD(notice.created_at)}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* 일반 강좌 그리드 */}
        {(posts?.length ?? 0) === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            등록된 강좌가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {posts?.map((post) => {
              const videoId = post.youtube_url ? extractYoutubeId(post.youtube_url) : null
              const thumbnail = videoId ? getYoutubeThumbnail(videoId) : null
              const hasArticle = !!post.article_url
              const formatted = formatYMD(post.created_at)

              return (
                <Link
                  key={post.id}
                  href={`/community/open-lecture/${post.id}`}
                  className="group flex flex-col rounded-xl overflow-hidden border border-slate-200 hover:shadow-md transition-shadow bg-white"
                >
                  {/* 썸네일 */}
                  <div className="relative aspect-video bg-slate-100 overflow-hidden">
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : hasArticle ? (
                      <div className="w-full h-full relative overflow-hidden bg-[#1a2744]">
                        {/* 배경 원형 장식 */}
                        <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/5" />
                        <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/5" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white/3" />

                        {/* 강단 일러스트 (SVG) */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
                          <svg viewBox="0 0 80 64" className="w-20 h-16 opacity-90" fill="none" xmlns="http://www.w3.org/2000/svg">
                            {/* 강단 상판 */}
                            <rect x="20" y="22" width="40" height="5" rx="2" fill="#93c5fd" fillOpacity="0.7" />
                            {/* 강단 기둥 */}
                            <rect x="34" y="27" width="12" height="18" rx="1" fill="#60a5fa" fillOpacity="0.5" />
                            {/* 마이크 스탠드 */}
                            <line x1="40" y1="18" x2="40" y2="22" stroke="#bfdbfe" strokeWidth="1.5" strokeLinecap="round" />
                            {/* 마이크 */}
                            <ellipse cx="40" cy="16" rx="3" ry="4" fill="#bfdbfe" fillOpacity="0.8" />
                            {/* 책 */}
                            <rect x="26" y="24" width="10" height="3" rx="0.5" fill="#e0f2fe" fillOpacity="0.6" />
                            <line x1="31" y1="24" x2="31" y2="27" stroke="#bfdbfe" strokeWidth="0.5" />
                            {/* 청중 점 */}
                            {[14, 24, 34, 44, 54, 64].map((x) => (
                              <circle key={x} cx={x} cy="54" r="2.5" fill="#93c5fd" fillOpacity="0.35" />
                            ))}
                            {[9, 19, 29, 39, 49, 59, 69].map((x) => (
                              <circle key={x} cx={x} cy="59" r="2.5" fill="#93c5fd" fillOpacity="0.2" />
                            ))}
                          </svg>
                          <span className="text-[10px] font-bold tracking-[0.2em] text-blue-200/60 uppercase">Lecture</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        <Play size={36} className="text-white/40" />
                      </div>
                    )}
                    {thumbnail && (
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play size={16} className="text-white ml-0.5" fill="white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="p-3.5 flex flex-col gap-1.5">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-sky-700 transition-colors">
                      {post.title}
                    </p>
                    {(post.location || post.event_date) && (
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                        {post.event_date && (
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {post.event_date}
                            {post.event_time && ` ${post.event_time.slice(0, 5)}`}
                          </span>
                        )}
                        {post.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={11} />
                            {post.location}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {formatted}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye size={11} />
                        {post.views}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath="/community/open-lecture"
        />
      </div>
    </>
  )
}
