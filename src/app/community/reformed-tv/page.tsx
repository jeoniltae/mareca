import { createClient } from "@/lib/supabase-server";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import {
  extractYoutubeId,
  getYoutubeThumbnail,
} from "@/features/youtube/youtube-utils";
import { PenSquare, Play, Calendar, Eye } from "lucide-react";
import Link from "next/link";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ReformedTV',
  description: '개혁신학 강의, 설교, 특강 영상을 모아볼 수 있는 채널입니다.',
  openGraph: { title: 'ReformedTV', description: '개혁신학 강의, 설교, 특강 영상을 모아볼 수 있는 채널입니다.', url: '/community/reformed-tv' },
}

const PAGE_SIZE = 12;

const CATEGORIES = ['전체', '일반', '숏츠'] as const

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function ReformedTVPage({ searchParams }: Props) {
  const { page: pageParam, category: categoryParam } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1) || 1);
  const category = CATEGORIES.includes(categoryParam as typeof CATEGORIES[number]) ? categoryParam : '전체';
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  let query = supabase
    .from("posts")
    .select("id, title, youtube_url, views, created_at, category, profiles(nickname)", { count: "exact" })
    .eq("board", "reformed-tv")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (category && category !== '전체') query = query.eq('category', category);

  const [
    { data: { user } },
    { data: posts, count },
  ] = await Promise.all([supabase.auth.getUser(), query]);

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="ReformedTV"
        breadcrumbs={[
          { label: "커뮤니티", href: "/community" },
          { label: "ReformedTV" },
        ]}
        backgroundImage="/images/breadcrumb/monument.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 10%"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 툴바 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={cat === '전체' ? '/community/reformed-tv' : `/community/reformed-tv?category=${cat}`}
                className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                  category === cat || (cat === '전체' && !categoryParam)
                    ? 'bg-sky-600 text-white border-sky-600 font-semibold'
                    : 'text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
          {user && (
            <Link
              href="/community/reformed-tv/new"
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors"
            >
              <PenSquare size={14} />
              영상 등록
            </Link>
          )}
        </div>
        <p className="text-sm text-slate-500 mb-6">
          총 <strong className="text-slate-800">{count ?? 0}</strong>개의 영상
        </p>

        {/* 그리드 */}
        {(posts?.length ?? 0) === 0 ? (
          <div className="py-20 text-center text-slate-400 text-sm">
            등록된 영상이 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {posts?.map((post) => {
              const videoId = post.youtube_url
                ? extractYoutubeId(post.youtube_url)
                : null;
              const thumbnail = videoId ? getYoutubeThumbnail(videoId) : null;
              const date = new Date(post.created_at ?? "");
              const formatted = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;

              return (
                <Link
                  key={post.id}
                  href={`/community/reformed-tv/${post.id}`}
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
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-800">
                        <Play size={36} className="text-white/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play
                          size={16}
                          className="text-white ml-0.5"
                          fill="white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 정보 */}
                  <div className="p-3.5 flex flex-col gap-1.5">
                    <p className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-sky-700 transition-colors">
                      {post.title}
                    </p>
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
              );
            })}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={category && category !== '전체' ? `/community/reformed-tv?category=${category}` : '/community/reformed-tv'}
        />
      </div>
    </>
  );
}
