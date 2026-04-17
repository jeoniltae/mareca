import { createClient } from '@/lib/supabase-server'
import { PageHeader } from '@/components/shared/PageHeader'
import { cn } from '@/lib/utils'
import { Search, PenSquare, Eye, ChevronLeft, ChevronRight, Pin } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: '자유게시판' }

const CATEGORIES = ['전체', '공지', '일반', '질문', '나눔'] as const

const CATEGORY_STYLE: Record<string, string> = {
  공지: 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-200',
  일반: 'bg-slate-100 text-slate-600',
  질문: 'bg-sky-50 text-sky-600 ring-1 ring-inset ring-sky-200',
  나눔: 'bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200',
}

export default async function CommunityFreePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: posts, count } = await supabase
    .from('posts')
    .select('id, category, title, views, created_at, profiles(nickname)', { count: 'exact' })
    .eq('board', 'free')
    .order('created_at', { ascending: false })
    .limit(20)

  const pinned = posts?.filter((p) => p.category === '공지') ?? []
  const regular = posts?.filter((p) => p.category !== '공지') ?? []

  return (
    <>
      <PageHeader
        title="자유게시판"
        breadcrumbs={[{ label: '커뮤니티', href: '/community' }, { label: '자유게시판' }]}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 툴바 */}
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
              href="/community/free/new"
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors"
            >
              <PenSquare size={14} />
              글쓰기
            </Link>
          )}
        </div>

        {/* 검색 */}
        <div className="relative mb-6">
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

        {/* 게시글 수 */}
        <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
          <span>
            총 <strong className="text-slate-800">{count ?? 0}</strong>개의 게시글
          </span>
        </div>

        {/* 목록 */}
        <div className="border-t border-slate-200 pt-1">
          {pinned.map((post) => (
            <PostRow key={post.id} post={post} isPinned />
          ))}

          {pinned.length > 0 && regular.length > 0 && (
            <div className="border-t border-dashed border-slate-200 my-1" />
          )}

          {regular.map((post) => (
            <PostRow key={post.id} post={post} />
          ))}

          {(posts?.length ?? 0) === 0 && (
            <div className="py-16 text-center text-slate-400 text-sm">
              아직 게시글이 없습니다.
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {(count ?? 0) > 20 && (
          <div className="flex items-center justify-center gap-1 mt-8">
            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                className={cn(
                  'w-9 h-9 rounded-lg text-sm font-medium transition-colors',
                  page === 1
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
                )}
              >
                {page}
              </button>
            ))}
            <button className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
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
    created_at: string
    profiles: { nickname: string | null } | null
  }
  isPinned?: boolean
}

function PostRow({ post, isPinned }: PostRowProps) {
  const date = new Date(post.created_at)
  const formatted = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  const isNew = Date.now() - date.getTime() < 1000 * 60 * 60 * 24

  return (
    <Link
      href={`/community/free/${post.id}`}
      className={cn(
        'group flex items-center gap-3 py-3.5 px-2 -mx-2 rounded-lg hover:bg-slate-50 transition-colors',
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
        <span className="hidden sm:block w-14 text-right truncate">
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
