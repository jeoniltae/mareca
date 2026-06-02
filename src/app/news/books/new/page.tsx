// 리폼드북스 도서 등록 페이지 — 관리자 전용
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/shared/PageHeader'
import { BookForm } from '@/features/books/BookForm'
import { getIsAdmin } from '@/lib/admin'

export const metadata = { title: '도서 등록 — 리폼드북스' }

export default async function NewBookPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login?next=/news/books/new')

  const isAdmin = await getIsAdmin()
  if (!isAdmin) redirect('/news/books')

  return (
    <>
      <PageHeader
        title="도서 등록"
        breadcrumbs={[
          { label: '소식', href: '/news' },
          { label: '리폼드북스', href: '/news/books' },
          { label: '도서 등록' },
        ]}
        backgroundImage="/images/breadcrumb/cornelius_vantil.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 26%"
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BookForm mode="create" cancelHref="/news/books" />
      </div>
    </>
  )
}
