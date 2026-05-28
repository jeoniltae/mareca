// 리폼드북스 목록에서 사용하는 도서 카드 컴포넌트
import Image from 'next/image'
import Link from 'next/link'
import type { BookSections } from './actions'

interface BookSquareProps {
  book: {
    id: string
    title: string
    thumbnail_url: string | null
    sections: unknown
    created_at: string | null
  }
}

export function BookSquare({ book }: BookSquareProps) {
  const sections = book.sections as BookSections | null
  const author = sections?.book_info?.author ?? ''
  const subtitle = sections?.book_info?.subtitle ?? ''
  const publisher = sections?.book_info?.publisher ?? ''

  return (
    <Link
      href={`/news/books/${book.id}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden"
    >
      {/* 이미지 영역 */}
      <div className="relative aspect-2/3 overflow-hidden bg-slate-100">
        {book.thumbnail_url ? (
          <Image
            src={book.thumbnail_url}
            alt={`${book.title} 표지`}
            fill
            className="object-cover scale-[1.02] group-hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-200">
            <span className="text-xs text-slate-400 text-center px-2">{book.title}</span>
          </div>
        )}
      </div>

      {/* 텍스트 영역 */}
      <div className="px-3 py-3 flex flex-col gap-1">
        <p className="text-sm font-bold text-slate-800 line-clamp-2 group-hover:text-sky-700 transition-colors leading-snug">
          {book.title}
        </p>
        {subtitle && (
          <p className="text-xs text-sky-600 italic line-clamp-1">{subtitle}</p>
        )}
        <p className="text-xs text-slate-700 truncate">
          {[author, publisher].filter(Boolean).join(' · ')}
        </p>
      </div>
    </Link>
  )
}
