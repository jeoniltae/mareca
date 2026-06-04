// 리폼드북스 목록 페이지 — 4열 그리드

import { createClient } from '@/lib/supabase-server'
import { PageHeader } from '@/components/shared/PageHeader'
import { Pagination } from '@/components/shared/Pagination'
import { BookSquare } from '@/features/books/BookSquare'
import Link from 'next/link'
import { PenSquare } from 'lucide-react'
import { getIsAdmin } from '@/lib/admin'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '리폼드북스',
  description: '마스터스개혁파총회가 소개하는 리폼드북스 도서 목록입니다.',
  openGraph: {
    title: '리폼드북스',
    description: '마스터스개혁파총회가 소개하는 리폼드북스 도서 목록입니다.',
    url: `${process.env.NEXT_PUBLIC_SITE_URL}/news/books`,
  },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/news/books` },
}

const PAGE_SIZE = 12

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function BooksPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam ?? 1) || 1)
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  const supabase = await createClient()
  const [{ data: books, count }, isAdmin] = await Promise.all([
    supabase
      .from('posts')
      .select('id, title, thumbnail_url, sections, created_at', { count: 'exact' })
      .eq('board', 'reformed-books')
      .order('created_at', { ascending: false })
      .range(from, to),
    getIsAdmin(),
  ])

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  return (
    <>
      <PageHeader
        title="리폼드북스"
        breadcrumbs={[{ label: '소식', href: '/news' }, { label: '리폼드북스' }]}
        backgroundImage="/images/breadcrumb/cornelius_vantil.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 26%"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdmin && (
          <div className="flex justify-end mb-6">
            <Link
              href="/news/books/new"
              className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors"
            >
              <PenSquare size={14} />
              도서 소개 등록
            </Link>
          </div>
        )}

        {books && books.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {books.map((book) => (
              <BookSquare key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center text-slate-400 text-sm">등록된 도서가 없습니다.</div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} basePath="/news/books" />
      </div>
    </>
  )
}
