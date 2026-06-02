// 리폼드북스 도서 수정 페이지 — 관리자 전용
import { createClient } from '@/lib/supabase-server'
import { redirect, notFound } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { BookForm } from '@/features/books/BookForm'
import { getIsAdmin } from '@/lib/admin'
import type { BookSections } from '@/features/books/actions'

interface Props {
  params: Promise<{ id: string }>
}

export const metadata = { title: '도서 수정 — 리폼드북스' }

export default async function EditBookPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/news/books/${id}/edit`)

  const isAdmin = await getIsAdmin()
  if (!isAdmin) redirect(`/news/books/${id}`)

  const { data: post } = await supabase
    .from('posts')
    .select('title, thumbnail_url, sections')
    .eq('id', id)
    .single()

  if (!post) return notFound()

  const sections = (post.sections as unknown as BookSections | null) ?? null

  return (
    <>
      <PageHeader
        title="도서 수정"
        breadcrumbs={[
          { label: '소식', href: '/news' },
          { label: '리폼드북스', href: '/news/books' },
          { label: post.title, href: `/news/books/${id}` },
          { label: '수정' },
        ]}
        backgroundImage="/images/breadcrumb/cornelius_vantil.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 26%"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookForm
          mode="edit"
          id={id}
          defaultValues={{ title: post.title, thumbnail_url: post.thumbnail_url, sections }}
          cancelHref={`/news/books/${id}`}
        />
      </div>
    </>
  )
}
