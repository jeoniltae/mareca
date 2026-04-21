import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Props {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null

  const href = (page: number) => `${basePath}?page=${page}`

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {currentPage > 1 ? (
        <Link href={href(currentPage - 1)} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span className="p-2 rounded-lg text-slate-200 cursor-not-allowed">
          <ChevronLeft size={16} />
        </span>
      )}

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-slate-400">
            ···
          </span>
        ) : (
          <Link
            key={page}
            href={href(page)}
            className={cn(
              'w-9 h-9 rounded-lg text-sm font-medium transition-colors flex items-center justify-center',
              page === currentPage
                ? 'bg-slate-800 text-white'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100',
            )}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link href={href(currentPage + 1)} className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span className="p-2 rounded-lg text-slate-200 cursor-not-allowed">
          <ChevronRight size={16} />
        </span>
      )}
    </div>
  )
}
