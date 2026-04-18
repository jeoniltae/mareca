import { createClient } from '@/lib/supabase-server'
import { PageHeader } from '@/components/shared/PageHeader'
import Link from 'next/link'
import { PenSquare, Images } from 'lucide-react'
import { GalleryImage } from '@/features/gallery/GalleryImage'

export const metadata = { title: '갤러리' }

export default async function CommunityGalleryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from('posts')
    .select('id, title, thumbnail_url, created_at, profiles(nickname)')
    .eq('board', 'gallery')
    .order('created_at', { ascending: false })

  const { data: imageCounts } = await supabase
    .from('post_images')
    .select('post_id')

  const countMap = (imageCounts ?? []).reduce<Record<string, number>>((acc, row) => {
    acc[row.post_id] = (acc[row.post_id] ?? 0) + 1
    return acc
  }, {})

  return (
    <>
      <PageHeader
        title="갤러리"
        breadcrumbs={[{ label: '커뮤니티', href: '/community' }, { label: '갤러리' }]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 툴바 */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-slate-500">
            총 <strong className="text-slate-800">{posts?.length ?? 0}</strong>개의 게시물
          </p>
          {user && (
            <Link
              href="/community/gallery/new"
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors"
            >
              <PenSquare size={14} />
              글쓰기
            </Link>
          )}
        </div>

        {/* 그리드 */}
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {posts.map((post) => {
              const date = new Date(post.created_at)
              const formatted = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
              const count = countMap[post.id] ?? 0

              return (
                <Link
                  key={post.id}
                  href={`/community/gallery/${post.id}`}
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
                    {count > 1 && (
                      <span className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
                        <Images size={11} />
                        {count}
                      </span>
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="p-3 flex flex-col gap-1">
                    <p className="text-sm font-medium text-slate-800 line-clamp-1 group-hover:text-sky-700 transition-colors">
                      {post.title}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="truncate">
                        {(post.profiles as { nickname: string | null } | null)?.nickname ?? '알 수 없음'}
                      </span>
                      <span className="shrink-0">{formatted}</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="py-24 text-center text-slate-400 text-sm">
            아직 게시물이 없습니다.
          </div>
        )}
      </div>
    </>
  )
}
