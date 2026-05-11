import { createClient } from "@/lib/supabase-server";
import { formatYMD } from "@/lib/date";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import Link from "next/link";
import { PenSquare, Images, Eye } from "lucide-react";
import { AuthorIcon } from "@/components/shared/AuthorIcon";
import { GalleryImage } from "@/features/gallery/GalleryImage";
import { YEAR_CATEGORIES } from '@/lib/constants'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '행사앨범',
  description: '마스터스개혁파총회 행사 및 모임의 사진 앨범입니다.',
  openGraph: { title: '행사앨범', description: '마스터스개혁파총회 행사 및 모임의 사진 앨범입니다.', url: '/community/album' },
}

const PAGE_SIZE = 12;
const FILTER_CATEGORIES = ['전체', ...YEAR_CATEGORIES] as const;
type FilterCategory = typeof FILTER_CATEGORIES[number];

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>;
}

export default async function CommunityGalleryPage({ searchParams }: Props) {
  const { page: pageParam, category: categoryParam } = await searchParams;
  const category: FilterCategory = FILTER_CATEGORIES.includes(categoryParam as FilterCategory)
    ? (categoryParam as FilterCategory)
    : '전체';
  const page = Math.max(1, Number(pageParam ?? 1) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase
    .from("posts")
    .select("id, title, thumbnail_url, views, created_at, profiles(nickname, is_admin, is_masters)", {
      count: "exact",
    })
    .eq("board", "gallery")
    .order("created_at", { ascending: false })
    .range(from, to);

  if (category !== '전체') query = query.eq('category', category);

  const { data: posts, count } = await query;

  const postIds = (posts ?? []).map((p) => p.id);
  const { data: imageCounts } =
    postIds.length > 0
      ? await supabase
          .from("post_images")
          .select("post_id")
          .in("post_id", postIds)
      : { data: [] };

  const countMap = (imageCounts ?? []).reduce<Record<string, number>>(
    (acc, row) => {
      acc[row.post_id] = (acc[row.post_id] ?? 0) + 1;
      return acc;
    },
    {},
  );

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="행사앨범"
        breadcrumbs={[
          { label: "커뮤니티", href: "/community" },
          { label: "행사앨범" },
        ]}
        backgroundImage="/images/breadcrumb/monument.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 10%"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 툴바 */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-500">
            총 <strong className="text-slate-800">{count ?? 0}</strong>개의
            게시물
          </p>
          {user && (
            <Link
              href="/community/album/new"
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors"
            >
              <PenSquare size={14} />
              글쓰기
            </Link>
          )}
        </div>

        {/* 연도 필터 */}
        <div className="flex flex-wrap gap-2 mb-6">
          {FILTER_CATEGORIES.map((cat) => {
            const isActive = cat === category;
            const href = cat === '전체' ? '/community/album' : `/community/album?category=${encodeURIComponent(cat)}`;
            return (
              <Link
                key={cat}
                href={href}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-sky-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </Link>
            );
          })}
        </div>

        {/* 그리드 */}
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {posts.map((post) => {
              const formatted = formatYMD(post.created_at);
              const imgCount = countMap[post.id] ?? 0;

              return (
                <Link
                  key={post.id}
                  href={`/community/album/${post.id}`}
                  className="group flex flex-col rounded-xl overflow-hidden border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all"
                >
                  {/* 썸네일 */}
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    {post.thumbnail_url ? (
                      <GalleryImage
                        src={post.thumbnail_url}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Images size={36} />
                      </div>
                    )}
                    {imgCount > 1 && (
                      <span className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                        <Images size={11} />
                        {imgCount}
                      </span>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="p-3 flex flex-col gap-1">
                    <p className="text-sm font-medium text-slate-800 line-clamp-1 group-hover:text-sky-700 transition-colors">
                      {post.title}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1 truncate">
                        <AuthorIcon isAdmin={(post.profiles as { nickname: string | null; is_admin: boolean | null; is_masters: boolean | null } | null)?.is_admin} isMasters={(post.profiles as { nickname: string | null; is_admin: boolean | null; is_masters: boolean | null } | null)?.is_masters} />
                        <span className="truncate">{(post.profiles as { nickname: string | null; is_admin: boolean | null; is_masters: boolean | null } | null)?.nickname ?? "알 수 없음"}</span>
                      </span>
                      <div className="shrink-0 flex items-center gap-2">
                        <span className="flex items-center gap-0.5">
                          <Eye size={11} />
                          {post.views}
                        </span>
                        <span>{formatted}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-24 text-center text-slate-400 text-sm">
            아직 게시물이 없습니다.
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={category !== '전체' ? `/community/album?category=${encodeURIComponent(category)}` : '/community/album'}
        />
      </div>
    </>
  );
}
