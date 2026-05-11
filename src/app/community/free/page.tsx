import { AuthorIcon } from '@/components/shared/AuthorIcon'
import { createClient } from "@/lib/supabase-server";
import { formatMonthDay, isNewPost } from "@/lib/date";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { cn } from "@/lib/utils";
import { BoardSearch } from "@/components/shared/BoardSearch";
import { PenSquare, Eye, Pin } from "lucide-react";
import Link from "next/link";

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '자유게시판',
  description: '마스터스개혁파총회 회원들의 자유로운 소통 공간입니다.',
  openGraph: { title: '자유게시판', description: '마스터스개혁파총회 회원들의 자유로운 소통 공간입니다.', url: '/community/free' },
}

const PAGE_SIZE = 10;

const CATEGORIES = ["전체", "공지", "일반", "질문", "나눔"] as const;

const CATEGORY_STYLE: Record<string, string> = {
  공지: "bg-red-50 text-red-600 ring-1 ring-inset ring-red-200",
  일반: "bg-slate-100 text-slate-600",
  질문: "bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-200",
  나눔: "bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200",
};

interface Props {
  searchParams: Promise<{ page?: string; category?: string; q?: string }>;
}

export default async function CommunityFreePage({ searchParams }: Props) {
  const { page: pageParam, category: categoryParam, q: qParam } = await searchParams;
  const q = qParam?.trim() ?? '';
  const page = Math.max(1, Number(pageParam ?? 1) || 1);
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;
  const activeCategory = CATEGORIES.includes(categoryParam as typeof CATEGORIES[number])
    ? (categoryParam as typeof CATEGORIES[number])
    : '전체';

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isFiltered = activeCategory !== '전체';

  let pinned: { id: string; category: string; title: string; views: number; created_at: string | null; profiles: { nickname: string | null; is_admin: boolean | null; is_masters: boolean | null } | null }[] = [];
  let regular: typeof pinned = [];
  let regularCount = 0;

  if (q) {
    const { data, count } = await supabase
      .from("posts")
      .select("id, category, title, views, created_at, profiles(nickname, is_admin, is_masters)", { count: "exact" })
      .eq("board", "free")
      .ilike("title", `%${q}%`)
      .order("created_at", { ascending: false });
    regular = data ?? [];
    regularCount = count ?? 0;
  } else if (isFiltered) {
    const { data, count } = await supabase
      .from("posts")
      .select("id, category, title, views, created_at, profiles(nickname, is_admin, is_masters)", { count: "exact" })
      .eq("board", "free")
      .eq("category", activeCategory)
      .order("created_at", { ascending: false })
      .range(from, to);
    regular = data ?? [];
    regularCount = count ?? 0;
  } else {
    const [{ data: pinnedData }, { data: regularData, count }] = await Promise.all([
      supabase
        .from("posts")
        .select("id, category, title, views, created_at, profiles(nickname, is_admin, is_masters)")
        .eq("board", "free")
        .eq("category", "공지")
        .order("created_at", { ascending: false }),
      supabase
        .from("posts")
        .select("id, category, title, views, created_at, profiles(nickname, is_admin, is_masters)", { count: "exact" })
        .eq("board", "free")
        .neq("category", "공지")
        .order("created_at", { ascending: false })
        .range(from, to),
    ]);
    pinned = pinnedData ?? [];
    regular = regularData ?? [];
    regularCount = count ?? 0;
  }

  const totalCount = pinned.length + regularCount;
  const totalPages = Math.ceil(regularCount / PAGE_SIZE);

  return (
    <>
      <PageHeader
        title="자유게시판"
        breadcrumbs={[
          { label: "커뮤니티", href: "/community" },
          { label: "자유게시판" },
        ]}
        backgroundImage="/images/breadcrumb/monument.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 10%"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 툴바 */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((cat) => {
              const isActive = cat === activeCategory;
              const href = cat === '전체' ? '/community/free' : `/community/free?category=${cat}`;
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
              href="/community/free/new"
              className="shrink-0 hidden sm:flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors"
            >
              <PenSquare size={14} />
              글쓰기
            </Link>
          )}
        </div>

        {/* 검색 + 모바일 글쓰기 버튼 */}
        <div className="flex flex-col sm:block gap-2 mb-6">
          <BoardSearch defaultValue={q} />

          {user && (
            <Link
              href="/community/free/new"
              className="sm:hidden flex items-center justify-center gap-1.5 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors"
            >
              <PenSquare size={14} />
              글쓰기
            </Link>
          )}
        </div>

        {/* 게시글 수 */}
        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
          <span>
            총 <strong className="text-slate-800">{totalCount}</strong>개의 게시글
            {q && <span className="ml-1 text-sky-600">— &quot;{q}&quot; 검색 결과</span>}
          </span>
        </div>

        {/* 목록 */}
        <div className="border-t border-slate-200 pt-1">
          {pinned?.map((post) => (
            <PostRowBoth key={post.id} post={post} isPinned />
          ))}

          {(pinned?.length ?? 0) > 0 && (regular?.length ?? 0) > 0 && (
            <div className="border-t border-dashed border-slate-200 my-1" />
          )}

          {regular?.map((post) => (
            <PostRowBoth key={post.id} post={post} />
          ))}

          {totalCount === 0 && (
            <div className="py-16 text-center text-slate-400 text-sm">
              아직 게시글이 없습니다.
            </div>
          )}
        </div>

        {!q && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            basePath={isFiltered ? `/community/free?category=${activeCategory}` : "/community/free"}
          />
        )}
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
  isPinned?: boolean;
};

function PostRow({ post, isPinned }: PostRowProps) {
  const formatted = formatMonthDay(post.created_at);
  const isNew = isNewPost(post.created_at);

  return (
    <Link
      href={`/community/free/${post.id}`}
      className={cn(
        "group py-3.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors",
        "flex sm:hidden flex-col gap-1.5",
        isPinned && "bg-slate-50/80 hover:bg-slate-100/80",
      )}
    >
      {/* 모바일: 1행 — 카테고리 + NEW / 날짜 */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {isPinned && <Pin size={12} className="shrink-0 text-slate-400" />}
          <span
            className={cn(
              "shrink-0 text-xs px-2 py-0.5 rounded-md font-medium",
              CATEGORY_STYLE[post.category],
            )}
          >
            {post.category}
          </span>
        </div>
        <span className="text-xs text-slate-400">{formatted}</span>
      </div>

      {/* 모바일: 2행 — 제목 / 조회수 */}
      <div className="flex items-end justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={cn(
              "text-sm line-clamp-2 group-hover:text-sky-700 transition-colors leading-snug",
              isPinned ? "text-slate-700 font-medium" : "text-slate-800",
            )}
          >
            {post.title}
          </span>
          {isNew && !isPinned && (
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

function PostRowDesktop({ post, isPinned }: PostRowProps) {
  const formatted = formatMonthDay(post.created_at);
  const isNew = isNewPost(post.created_at);

  return (
    <Link
      href={`/community/free/${post.id}`}
      className={cn(
        "group hidden sm:flex items-center gap-3 py-3.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors",
        isPinned && "bg-slate-50/80 hover:bg-slate-100/80",
      )}
    >
      <span
        className={cn(
          "shrink-0 text-xs px-2 py-0.5 rounded-md font-medium",
          CATEGORY_STYLE[post.category],
        )}
      >
        {post.category}
      </span>

      <div className="flex flex-1 min-w-0 items-center gap-2">
        {isPinned && <Pin size={12} className="shrink-0 text-slate-400" />}
        <span
          className={cn(
            "text-sm line-clamp-1 group-hover:text-sky-700 transition-colors",
            isPinned ? "text-slate-700 font-medium" : "text-slate-800",
          )}
        >
          {post.title}
        </span>
        {isNew && !isPinned && (
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
