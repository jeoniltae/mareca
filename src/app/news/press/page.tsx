import { createClient } from '@/lib/supabase-server'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { ExternalLink } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ArticleShareButton } from './ArticleShareButton'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '관련기사',
  description: '마스터스개혁파총회와 관련된 언론 기사를 모아볼 수 있습니다.',
  openGraph: { title: '관련기사', description: '마스터스개혁파총회와 관련된 언론 기사를 모아볼 수 있습니다.', url: '/news/press' },
}

const PAGE_SIZE = 12

const SOURCES = ['전체', '크리스천투데이', '기독일보'] as const
type Source = (typeof SOURCES)[number]

const SOURCE_STYLE: Record<string, string> = {
  기독일보: 'bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-200',
  크리스천투데이: 'bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200',
}

interface Props {
  searchParams: Promise<{ page?: string; source?: string }>
}

export default async function NewsPressPage({ searchParams }: Props) {
  const { page: pageParam, source: sourceParam } = await searchParams
  const page = Math.max(1, Number(pageParam ?? 1) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const activeSource: Source =
    SOURCES.includes(sourceParam as Source) ? (sourceParam as Source) : '전체'

  const supabase = await createClient()

  let query = supabase
    .from('press_articles')
    .select('id, url, og_title, og_image, og_description, source_name, published_at, created_at', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(from, to)

  if (activeSource !== '전체') {
    query = query.eq('source_name', activeSource)
  }

  const { data: articles, count } = await query

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  function sourceHref(source: Source) {
    const params = new URLSearchParams()
    if (source !== '전체') params.set('source', source)
    const qs = params.toString()
    return `/news/press${qs ? `?${qs}` : ''}`
  }

  return (
    <>
      <PageHeader
        title="관련기사"
        breadcrumbs={[{ label: '소식', href: '/news' }, { label: '관련기사' }]}
        backgroundImage="/images/breadcrumb/cornelius_vantil.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 26%"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex gap-1.5 flex-wrap">
            {SOURCES.map((src) => (
              <Link
                key={src}
                href={sourceHref(src)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors',
                  activeSource === src
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
                )}
              >
                {src}
              </Link>
            ))}
          </div>
          <span className="text-sm text-slate-500 shrink-0">
            총 <strong className="text-slate-800">{count ?? 0}</strong>개
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {articles?.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}

          {(articles?.length ?? 0) === 0 && (
            <div className="col-span-2 py-16 text-center text-slate-400 text-sm">
              관련 기사가 없습니다.
            </div>
          )}
        </div>

        <Pagination
          currentPage={page}
          totalPages={totalPages}
          basePath={activeSource !== '전체' ? `/news/press?source=${activeSource}` : '/news/press'}
        />
      </div>
    </>
  )
}

const NEW_BADGE_DAYS = 14

type Article = {
  id: string
  url: string
  og_title: string | null
  og_image: string | null
  og_description: string | null
  source_name: string | null
  published_at: string | null
  created_at: string | null
}

function ArticleCard({ article }: { article: Article }) {
  const sourceStyle = article.source_name
    ? (SOURCE_STYLE[article.source_name] ?? 'bg-slate-100 text-slate-600')
    : 'bg-slate-100 text-slate-600'
  const isNew = article.created_at
    ? Date.now() - new Date(article.created_at).getTime() < NEW_BADGE_DAYS * 24 * 60 * 60 * 1000
    : false

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col border border-slate-200 rounded-xl overflow-hidden hover:shadow-md hover:border-slate-300 transition-all"
    >
      <div className="relative w-full h-40 bg-slate-100">
        {article.og_image ? (
          <Image
            src={article.og_image}
            alt={article.og_title ?? '기사 이미지'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300 text-sm">
            이미지 없음
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 p-4 flex-1">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {article.source_name && (
              <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${sourceStyle}`}>
                {article.source_name}
              </span>
            )}
            {isNew && (
              <span className="text-[10px] font-bold text-white bg-sky-500 px-1.5 py-0.5 rounded">
                NEW
              </span>
            )}
          </div>
          {article.published_at && (
            <span className="text-xs text-slate-400 ml-auto">{article.published_at}</span>
          )}
        </div>

        <p className="text-sm font-medium text-slate-800 line-clamp-2 group-hover:text-sky-700 transition-colors leading-snug">
          {article.og_title ?? '제목 없음'}
        </p>

        {article.og_description && (
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {article.og_description}
          </p>
        )}

        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-slate-400 group-hover:text-sky-600 transition-colors">
            <ExternalLink size={11} />
            원문 보기
          </div>
          <ArticleShareButton url={article.url} title={article.og_title ?? '관련기사'} imageUrl={article.og_image} />
        </div>
      </div>
    </a>
  )
}
