import { createClient } from '@/lib/supabase-server'
import { PageHeader } from '@/components/shared/PageHeader'
import { ShareButtons } from '@/components/shared/ShareButtons'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ExternalLink, CalendarDays, Newspaper, ChevronLeft } from 'lucide-react'
import { BackToListLink } from '@/components/shared/BackToListLink'
import { articleJsonLd } from '@/lib/json-ld'

import type { Metadata } from 'next'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('press_articles')
    .select('og_title, og_description, og_image, source_name')
    .eq('id', id)
    .single()

  if (!data) return {}

  const title = data.og_title ?? '관련기사'
  const description = data.og_description ?? '마스터스개혁파총회 관련 언론 기사입니다.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/news/press/${id}`,
      images: data.og_image ? [{ url: data.og_image }] : [],
    },
  }
}

const SOURCE_STYLE: Record<string, string> = {
  기독일보: 'bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-200',
  크리스천투데이: 'bg-emerald-50 text-emerald-600 ring-1 ring-inset ring-emerald-200',
}

export default async function PressArticleDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const { data: article } = await supabase
    .from('press_articles')
    .select('id, url, og_title, og_image, og_description, source_name, published_at')
    .eq('id', id)
    .single()

  if (!article) notFound()

  const sourceStyle = article.source_name
    ? (SOURCE_STYLE[article.source_name] ?? 'bg-slate-100 text-slate-600')
    : 'bg-slate-100 text-slate-600'

  const jsonLd = articleJsonLd({
    title: article.og_title ?? '관련기사',
    description: article.og_description ?? '마스터스개혁파총회 관련 언론 기사입니다.',
    url: `/news/press/${article.id}`,
    imageUrl: article.og_image ?? undefined,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <PageHeader
        title="관련기사"
        breadcrumbs={[{ label: '소식', href: '/news' }, { label: '관련기사', href: '/news/press' }, { label: article.og_title ?? '기사' }]}
        backgroundImage="/images/breadcrumb/cornelius_vantil.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 26%"
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 목록으로 */}
        <BackToListLink
          fallbackHref="/news/press"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-400 transition-colors mb-6"
        >
          <ChevronLeft size={15} />
          목록으로
        </BackToListLink>

        {/* 기사 헤더 */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            {article.source_name && (
              <span className={`text-xs px-2.5 py-1 rounded-md font-semibold ${sourceStyle}`}>
                {article.source_name}
              </span>
            )}
            {article.published_at && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <CalendarDays size={12} />
                {article.published_at}
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug tracking-tight mb-4">
            {article.og_title ?? '제목 없음'}
          </h1>

          <div className="h-px bg-slate-200" />
        </div>

        {/* 대표 이미지 */}
        {article.og_image && (
          <div className="w-full rounded-xl overflow-hidden mb-6 bg-slate-100">
            <Image
              src={article.og_image}
              alt={article.og_title ?? '기사 이미지'}
              width={0}
              height={0}
              sizes="100vw"
              className="w-full h-auto"
              unoptimized
            />
          </div>
        )}

        {/* 기사 요약 본문 */}
        {article.og_description && (
          <div className="mb-8">
            <div className="border-l-4 border-slate-300 pl-4 py-1">
              <p className="text-sm text-slate-500 font-medium mb-1 flex items-center gap-1">
                <Newspaper size={13} />
                기사 요약
              </p>
              <p className="text-base text-slate-700 leading-relaxed">
                {article.og_description}
              </p>
            </div>
          </div>
        )}

        {/* 원문 보기 버튼 */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl border-2 border-slate-800 text-slate-800 text-sm font-semibold hover:bg-slate-800 hover:text-white transition-colors mb-8"
        >
          <ExternalLink size={15} />
          원문 기사 보기
        </a>

        {/* 구분선 */}
        <div className="h-px bg-slate-100 mb-6" />

        {/* 공유 버튼 */}
        <div className="flex flex-col gap-3">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">공유하기</p>
          <ShareButtons
            title={article.og_title ?? '관련기사'}
            description={article.og_description ?? undefined}
            imageUrl={article.og_image ?? undefined}
          />
        </div>
      </div>
    </>
  )
}
