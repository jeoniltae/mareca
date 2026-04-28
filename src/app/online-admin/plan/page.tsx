import { createClient } from '@/lib/supabase-server'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { cn } from '@/lib/utils'
import { Search, PenSquare, Eye, Pin } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: '교회계획' }

const PAGE_SIZE = 10
const BOARD = 'church-plan'
const BOARD_PATH = '/online-admin/plan'

const CATEGORIES = ['전체', '공지', '일반'] as const

const CATEGORY_STYLE: Record<string, string> = {
  공지: 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-200',
  일반: 'bg-slate-100 text-slate-600',
}

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function OnlineAdminPlanPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam ?? 1) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [{ data: pinned }, { data: regular, count: regularCount }] = await Promise.all([
    supabase
      .from('posts')
      .select('id, category, title, views, created_at, profiles(nickname)')
      .eq('board', BOARD)
      .eq('category', '공지')
      .order('created_at', { ascending: false }),
    supabase
      .from('posts')
      .select('id, category, title, views, created_at, profiles(nickname)', { count: 'exact' })
      .eq('board', BOARD)
      .neq('category', '공지')
      .order('created_at', { ascending: false })
      .range(from, to),
  ])

  const totalCount = (pinned?.length ?? 0) + (regularCount ?? 0)
  const totalPages = Math.ceil((regularCount ?? 0) / PAGE_SIZE)

  return (
    <>
      <PageHeader
        title="교회계획"
        breadcrumbs={[{ label: '온라인행정', href: '/online-admin' }, { label: '교회계획' }]}
        backgroundImage="/images/breadcrumb/abraham_kuyper.png"
        bgColor="bg-slate-800"
        imagePosition="center 22%"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex gap-1.5 flex-wrap">
            {CATEGORIES.map((cat, i) => (
              <button
                key={cat}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors',
                  i === 0
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
                )}
              >
                {cat}
              </button>
            ))}
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
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            <input
              type="text"
              placeholder="제목 또는 내용으로 검색"
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 focus:bg-white transition-all"
            />
          </div>

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
            총 <strong className="text-slate-800">{totalCount}</strong>개의 게시글
          </span>
        </div>

        <div className="border-t border-slate-200 pt-1">
          {pinned?.map((post) => (
            <PostRowBoth key={post.id} post={post} basePath={BOARD_PATH} isPinned />
          ))}

          {(pinned?.length ?? 0) > 0 && (regular?.length ?? 0) > 0 && (
            <div className="border-t border-dashed border-slate-200 my-1" />
          )}

          {regular?.map((post) => (
            <PostRowBoth key={post.id} post={post} basePath={BOARD_PATH} />
          ))}

          {totalCount === 0 && (
            <div className="py-16 text-center text-slate-400 text-sm">
              아직 게시글이 없습니다.
            </div>
          )}
        </div>

        <Pagination currentPage={page} totalPages={totalPages} basePath={BOARD_PATH} />
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
    profiles: { nickname: string | null } | null
  }
  basePath: string
  isPinned?: boolean
}

function PostRow({ post, basePath, isPinned }: PostRowProps) {
  const date = new Date(post.created_at ?? '')
  const formatted = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const isNew = Date.now() - date.getTime() < 1000 * 60 * 60 * 24

  return (
    <Link
      href={`${basePath}/${post.id}`}
      className={cn(
        'group py-3.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors',
        'flex sm:hidden flex-col gap-1.5',
        isPinned && 'bg-slate-50/80 hover:bg-slate-100/80',
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {isPinned && <Pin size={12} className="shrink-0 text-slate-400" />}
          <span className={cn('shrink-0 text-xs px-2 py-0.5 rounded-md font-medium', CATEGORY_STYLE[post.category])}>
            {post.category}
          </span>
          {isNew && !isPinned && (
            <span className="shrink-0 text-[10px] font-bold text-white bg-sky-500 px-1.5 py-0.5 rounded">
              NEW
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400">{formatted}</span>
      </div>

      <div className="flex items-end justify-between gap-2">
        <span
          className={cn(
            'text-sm line-clamp-2 group-hover:text-sky-700 transition-colors leading-snug',
            isPinned ? 'text-slate-700 font-medium' : 'text-slate-800',
          )}
        >
          {post.title}
        </span>
        <span className="shrink-0 flex items-center gap-1 text-xs text-slate-400">
          <Eye size={11} />
          {post.views}
        </span>
      </div>
    </Link>
  )
}

function PostRowDesktop({ post, basePath, isPinned }: PostRowProps) {
  const date = new Date(post.created_at ?? '')
  const formatted = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const isNew = Date.now() - date.getTime() < 1000 * 60 * 60 * 24

  return (
    <Link
      href={`${basePath}/${post.id}`}
      className={cn(
        'group hidden sm:flex items-center gap-3 py-3.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors',
        isPinned && 'bg-slate-50/80 hover:bg-slate-100/80',
      )}
    >
      <span className={cn('shrink-0 text-xs px-2 py-0.5 rounded-md font-medium', CATEGORY_STYLE[post.category])}>
        {post.category}
      </span>

      <div className="flex flex-1 min-w-0 items-center gap-2">
        {isPinned && <Pin size={12} className="shrink-0 text-slate-400" />}
        <span
          className={cn(
            'text-sm line-clamp-1 group-hover:text-sky-700 transition-colors',
            isPinned ? 'text-slate-700 font-medium' : 'text-slate-800',
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
        <span className="w-28 text-right truncate">
          {post.profiles?.nickname ?? '알 수 없음'}
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
