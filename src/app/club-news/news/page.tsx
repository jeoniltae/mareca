import { AuthorIcon } from '@/components/shared/AuthorIcon'
import { createClient } from '@/lib/supabase-server'
import { formatMonthDay, isNewPost } from '@/lib/date'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { BoardSearch } from '@/components/shared/BoardSearch'
import { cn } from '@/lib/utils'
import { PenSquare, Eye, Pin } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: '소식 — 클럽소식',
  description: '마스터스개혁파총회 소속 교회들의 소식과 공지를 전합니다.',
}

const PAGE_SIZE = 10

interface Props {
  searchParams: Promise<{ page?: string; q?: string }>
}

export default async function ClubNewsNewsPage({ searchParams }: Props) {
  const { page: pageParam, q: qParam } = await searchParams
  const q = qParam?.trim() ?? ''
  const page = Math.max(1, Number(pageParam ?? 1) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  type Post = { id: string; category: string; title: string; views: number; created_at: string | null; profiles: { nickname: string | null; is_admin: boolean | null; is_masters: boolean | null } | null }

  let pinned: Post[] = []
  let regular: Post[] = []
  let regularCount = 0
  let searchResults: Post[] = []

  if (q) {
    const { data } = await supabase
      .from('posts')
      .select('id, category, title, views, created_at, profiles(nickname, is_admin, is_masters)')
      .eq('board', 'club-news')
      .ilike('title', `%${q}%`)
      .order('created_at', { ascending: false })
    searchResults = data ?? []
  } else {
    const [{ data: pinnedData }, { data: regularData, count }] = await Promise.all([
      supabase
        .from('posts')
        .select('id, category, title, views, created_at, profiles(nickname, is_admin, is_masters)')
        .eq('board', 'club-news')
        .eq('category', '공지')
        .order('created_at', { ascending: false }),
      supabase
        .from('posts')
        .select('id, category, title, views, created_at, profiles(nickname, is_admin, is_masters)', { count: 'exact' })
        .eq('board', 'club-news')
        .neq('category', '공지')
        .order('created_at', { ascending: false })
        .range(from, to),
    ])
    pinned = pinnedData ?? []
    regular = regularData ?? []
    regularCount = count ?? 0
  }

  const totalCount = q ? searchResults.length : pinned.length + regularCount
  const totalPages = Math.ceil(regularCount / PAGE_SIZE)

  return (
    <>
      <PageHeader
        title="소식"
        breadcrumbs={[{ label: '클럽소식', href: '/club-news' }, { label: '소식' }]}
        backgroundImage="/images/breadcrumb/john_knox.jpg"
        bgColor="bg-slate-800"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-end gap-3 mb-5">
          {user && (
            <Link
              href="/club-news/news/new"
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
              href="/club-news/news/new"
              className="sm:hidden flex items-center justify-center gap-1.5 py-2.5 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors"
            >
              <PenSquare size={14} />
              글쓰기
            </Link>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
          <span>
            총 <strong className="text-slate-800">{totalCount}</strong>개의 게시글
            {q && <span className="ml-1 text-sky-600">— &quot;{q}&quot; 검색 결과</span>}
          </span>
        </div>

        <div className="border-t border-slate-200 pt-1">
          {q ? (
            <>
              {searchResults.map((post, i) => (
                <PostRowBoth key={post.id} post={post} isPinned={post.category === '공지'} rowNumber={i + 1} />
              ))}
              {searchResults.length === 0 && (
                <div className="py-16 text-center text-slate-400 text-sm">
                  검색 결과가 없습니다.
                </div>
              )}
            </>
          ) : (
            <>
              {pinned.map((post) => (
                <PostRowBoth key={post.id} post={post} isPinned />
              ))}
              {pinned.length > 0 && regular.length > 0 && (
                <div className="border-t border-dashed border-slate-200 my-1" />
              )}
              {regular.map((post, i) => (
                <PostRowBoth key={post.id} post={post} rowNumber={regularCount - from - i} />
              ))}
              {totalCount === 0 && (
                <div className="py-16 text-center text-slate-400 text-sm">
                  아직 게시글이 없습니다.
                </div>
              )}
            </>
          )}
        </div>

        {!q && <Pagination currentPage={page} totalPages={totalPages} basePath="/club-news/news" />}
      </div>
    </>
  )
}

type PostRowProps = {
  post: {
    id: string
    category: string
    title: string
    views: number
    created_at: string | null
    profiles: { nickname: string | null; is_admin: boolean | null; is_masters: boolean | null } | null
  }
  isPinned?: boolean
  rowNumber?: number
}

function PostRow({ post, isPinned, rowNumber }: PostRowProps) {
  const formatted = formatMonthDay(post.created_at)
  const isNew = isNewPost(post.created_at)

  return (
    <Link
      href={`/club-news/news/${post.id}`}
      className={cn(
        'group py-3.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors',
        'flex sm:hidden items-center gap-2',
        isPinned && 'bg-slate-50/80 hover:bg-slate-100/80',
      )}
    >
      {isPinned ? (
        <span className="shrink-0 text-xs px-2 py-0.5 rounded-md font-medium bg-red-50 text-red-600 ring-1 ring-inset ring-red-200">
          공지
        </span>
      ) : (
        <span className="shrink-0 text-xs w-8 text-center font-medium text-slate-400">
          {rowNumber}
        </span>
      )}
      <div className="flex flex-1 min-w-0 items-center gap-1.5">
        <span className={cn('text-sm line-clamp-1 group-hover:text-sky-700 transition-colors', isPinned ? 'text-slate-700 font-medium' : 'text-slate-800')}>
          {post.title}
        </span>
        {isNew && !isPinned && (
          <span className="shrink-0 text-[10px] font-bold text-white bg-sky-500 px-1.5 py-0.5 rounded">NEW</span>
        )}
      </div>
      <span className="shrink-0 text-xs text-slate-400">{formatted}</span>
    </Link>
  )
}

function PostRowDesktop({ post, isPinned, rowNumber }: PostRowProps) {
  const formatted = formatMonthDay(post.created_at)
  const isNew = isNewPost(post.created_at)

  return (
    <Link
      href={`/club-news/news/${post.id}`}
      className={cn(
        'group hidden sm:flex items-center gap-3 py-3.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors',
        isPinned && 'bg-slate-50/80 hover:bg-slate-100/80',
      )}
    >
      {isPinned ? (
        <span className="shrink-0 text-xs px-2 py-0.5 rounded-md font-medium bg-red-50 text-red-600 ring-1 ring-inset ring-red-200">
          공지
        </span>
      ) : (
        <span className="shrink-0 text-xs w-8 text-center font-medium text-slate-400">
          {rowNumber}
        </span>
      )}
      <div className="flex flex-1 min-w-0 items-center gap-2">
        {isPinned && <Pin size={12} className="shrink-0 text-slate-400" />}
        <span className={cn('text-sm line-clamp-1 group-hover:text-sky-700 transition-colors', isPinned ? 'text-slate-700 font-medium' : 'text-slate-800')}>
          {post.title}
        </span>
        {isNew && !isPinned && (
          <span className="shrink-0 text-[10px] font-bold text-white bg-sky-500 px-1.5 py-0.5 rounded">NEW</span>
        )}
      </div>
      <div className="shrink-0 flex items-center gap-3 text-xs text-slate-400">
        <span className="flex items-center justify-end gap-1 w-28">
          <AuthorIcon isAdmin={post.profiles?.is_admin} isMasters={post.profiles?.is_masters} />
          <span className="truncate">{post.profiles?.nickname ?? '알 수 없음'}</span>
        </span>
        <span className="w-10 text-right">{formatted}</span>
        <span className="flex items-center gap-1 w-12 justify-end">
          <Eye size={11} />
          {post.views}
        </span>
      </div>
    </Link>
  )
}

function PostRowBoth(props: PostRowProps) {
  return (
    <>
      <PostRow {...props} />
      <PostRowDesktop {...props} />
    </>
  )
}
