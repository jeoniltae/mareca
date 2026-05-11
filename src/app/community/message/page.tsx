import { AuthorIcon } from '@/components/shared/AuthorIcon'
import { createClient } from "@/lib/supabase-server";
import { formatMonthDay, isNewPost } from "@/lib/date";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { YEAR_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { BoardSearch } from "@/components/shared/BoardSearch";
import { PenSquare, Eye } from "lucide-react";
import Link from "next/link";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '마스터스 메시지',
  description: '총회를 향한 격려와 응원의 글을 나누는 공간입니다.',
  openGraph: { title: '마스터스 메시지', description: '총회를 향한 격려와 응원의 글을 나누는 공간입니다.', url: '/community/message' },
}

const PAGE_SIZE = 10;
const BOARD_PATH = '/community/message';

const FILTER_CATEGORIES = ['전체', ...YEAR_CATEGORIES] as const;
type FilterCategory = typeof FILTER_CATEGORIES[number];

interface Props {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}

export default async function CommunityMessagePage({ searchParams }: Props) {
  const { page: pageParam, category: categoryParam, q: qParam } = await searchParams;
  const q = qParam?.trim() ?? '';
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
    .select("id, category, title, views, created_at, profiles(nickname, is_admin, is_masters)", { count: "exact" })
    .eq("board", "message")
    .order("created_at", { ascending: false });

  if (category !== '전체') query = query.eq('category', category);
  if (q) query = query.ilike('title', `%${q}%`);
  if (!q) query = query.range(from, to);

  const { data: posts, count } = await query;

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE);
  const basePath = category !== '전체' ? `${BOARD_PATH}?category=${encodeURIComponent(category)}` : BOARD_PATH;

  return (
    <>
      <PageHeader
        title="마스터스 메시지"
        breadcrumbs={[
          { label: "커뮤니티", href: "/community" },
          { label: "마스터스 메시지" },
        ]}
        backgroundImage="/images/breadcrumb/monument.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 10%"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex gap-1.5 flex-wrap">
            {FILTER_CATEGORIES.map((cat) => {
              const isActive = cat === category;
              const href = cat === '전체' ? BOARD_PATH : `${BOARD_PATH}?category=${encodeURIComponent(cat)}`;
              return (
                <Link
                  key={cat}
                  href={href}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
                  )}
                >
                  {cat}
                </Link>
              );
            })}
          </div>

          {user && (
            <Link
              href={`${BOARD_PATH}/new`}
              className="shrink-0 hidden sm:flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors"
            >
              <PenSquare size={14} />
              글쓰기
            </Link>
          )}
        </div>

        <div className="flex flex-col sm:block gap-2 mb-6">
          <BoardSearch defaultValue={q} />

          {user && (
            <Link
              href={`${BOARD_PATH}/new`}
              className="sm:hidden flex items-center justify-center gap-1.5 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors"
            >
              <PenSquare size={14} />
              글쓰기
            </Link>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
          <span>
            총 <strong className="text-slate-800">{count ?? 0}</strong>개의 게시글
            {q && <span className="ml-1 text-sky-600">— &quot;{q}&quot; 검색 결과</span>}
          </span>
        </div>

        <div className="border-t border-slate-200 pt-1">
          {posts?.map((post) => (
            <PostRowBoth key={post.id} post={post} />
          ))}

          {(posts?.length ?? 0) === 0 && (
            <div className="py-16 text-center text-slate-400 text-sm">
              아직 게시글이 없습니다.
            </div>
          )}
        </div>

        {!q && <Pagination currentPage={page} totalPages={totalPages} basePath={basePath} />}
      </div>
    </>
  );
}

type PostRowProps = {
  post: {
    id: string;
    category: string;
    title: string;
    views: number;
    created_at: string | null;
    profiles: { nickname: string | null; is_admin: boolean | null; is_masters: boolean | null } | null;
  };
};

function PostRow({ post }: PostRowProps) {
  const formatted = formatMonthDay(post.created_at);
  const isNew = isNewPost(post.created_at);

  return (
    <Link
      href={`/community/message/${post.id}`}
      className="group py-3.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors flex sm:hidden flex-col gap-1.5"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="shrink-0 text-xs px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-600">
            {post.category}
          </span>
        </div>
        <span className="text-xs text-slate-400">{formatted}</span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="text-sm line-clamp-2 group-hover:text-sky-700 transition-colors leading-snug text-slate-800">
            {post.title}
          </span>
          {isNew && (
            <span className="shrink-0 text-[10px] font-bold text-white bg-sky-500 px-1.5 py-0.5 rounded">
              NEW
            </span>
          )}
        </div>
        <span className="shrink-0 flex items-center gap-1 text-xs text-slate-400">
          <Eye size={11} />
          {post.views}
        </span>
      </div>
    </Link>
  );
}

function PostRowDesktop({ post }: PostRowProps) {
  const formatted = formatMonthDay(post.created_at);
  const isNew = isNewPost(post.created_at);

  return (
    <Link
      href={`/community/message/${post.id}`}
      className="group hidden sm:flex items-center gap-3 py-3.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors"
    >
      <span className="shrink-0 text-xs px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-600">
        {post.category}
      </span>

      <div className="flex flex-1 min-w-0 items-center gap-2">
        <span className="text-sm line-clamp-1 group-hover:text-sky-700 transition-colors text-slate-800">
          {post.title}
        </span>
        {isNew && (
          <span className="shrink-0 text-[10px] font-bold text-white bg-sky-500 px-1.5 py-0.5 rounded">
            NEW
          </span>
        )}
      </div>

      <div className="shrink-0 flex items-center gap-3 text-xs text-slate-400">
        <span className="flex items-center justify-end gap-1 w-28">
            <AuthorIcon isAdmin={post.profiles?.is_admin} isMasters={post.profiles?.is_masters} />
            <span className="truncate">{post.profiles?.nickname ?? "알 수 없음"}</span>
          </span>
        <span className="w-10 text-right">{formatted}</span>
        <span className="flex items-center gap-1 w-12 justify-end">
          <Eye size={11} />
          {post.views}
        </span>
      </div>
    </Link>
  );
}

function PostRowBoth(props: PostRowProps) {
  return (
    <>
      <PostRow {...props} />
      <PostRowDesktop {...props} />
    </>
  );
}
