// 리폼드북스 도서 상세 페이지
import { createClient } from '@/lib/supabase-server'
import { notFound } from 'next/navigation'
import { getIsAdmin } from '@/lib/admin'
import { BookDetail } from '@/features/books/BookDetail'
import { ViewTracker } from '@/features/posts/ViewTracker'
import { articleJsonLd } from '@/lib/json-ld'
import type { BookSections } from '@/features/books/actions'
import { PageHeader } from '@/components/shared/PageHeader'

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('posts')
    .select('title, thumbnail_url, sections')
    .eq('id', id)
    .single()

  const sections = data?.sections as BookSections | null
  const description = sections?.book_intro?.replace(/\s+/g, ' ').trim().slice(0, 120) || '리폼드북스 도서 소개입니다.'

  return {
    title: data?.title ?? '도서 소개',
    description,
    openGraph: {
      title: data?.title ?? '도서 소개',
      description,
      images: data?.thumbnail_url ? [{ url: data.thumbnail_url, alt: data.title }] : ['/images/logo.png'],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: data?.title ?? '도서 소개',
      description,
      images: data?.thumbnail_url ? [data.thumbnail_url] : ['/images/logo.png'],
    },
    alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/news/books/${id}` },
  }
}

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: post }, { data: { user } }, isAdmin] = await Promise.all([
    supabase
      .from('posts')
      .select('id, title, thumbnail_url, sections, user_id, created_at, updated_at')
      .eq('id', id)
      .single(),
    supabase.auth.getUser(),
    getIsAdmin(),
  ])

  if (!post || post.sections === null) return notFound()

  const sections = post.sections as unknown as BookSections
  const isAuthor = user?.id === post.user_id

  return (
    <>
      <PageHeader
        title="리폼드북스"
        breadcrumbs={[
          { label: '소식', href: '/news' },
          { label: '리폼드북스', href: '/news/books' },
          { label: post.title },
        ]}
        backgroundImage="/images/breadcrumb/cornelius_vantil.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 26%"
      />

      <BookDetail
        id={id}
        title={post.title}
        thumbnail_url={post.thumbnail_url}
        sections={sections}
        isAdmin={isAdmin}
        isAuthor={isAuthor}
      />

      <ViewTracker id={id} boardPath="/news/books" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            articleJsonLd({
              title: post.title,
              description: sections.book_intro?.replace(/\s+/g, ' ').trim().slice(0, 120) ?? '',
              url: `${process.env.NEXT_PUBLIC_SITE_URL}/news/books/${id}`,
              datePublished: post.created_at ?? undefined,
              dateModified: post.updated_at ?? undefined,
              imageUrl: post.thumbnail_url ?? undefined,
            })
          ),
        }}
      />
    </>
  )
}
