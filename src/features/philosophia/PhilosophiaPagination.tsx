// 최더함의 철학시가 전용 페이지네이션 — 공용 Pagination이 라이트 톤이라 다크 배경에서 흰 판이 뜨는 문제로 따로 만든다. 페이지 윈도우 규칙은 공용과 동일하다

import { Link } from 'next-view-transitions'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { plexMono } from './fonts'

interface Props {
  currentPage: number
  totalPages: number
  basePath: string
}

export function PhilosophiaPagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null

  const href = (page: number) => `${basePath}${basePath.includes('?') ? '&' : '?'}page=${page}`

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
    <nav
      aria-label="페이지 이동"
      className={`${plexMono.className} mt-12 flex items-center justify-center gap-1 border-t border-[#EDE7D6]/15 pt-8`}
    >
      {currentPage > 1 ? (
        <Link
          href={href(currentPage - 1)}
          aria-label="이전 페이지"
          className="p-2 text-[#EDE7D6]/45 transition-colors hover:text-[#D9B441]"
        >
          <ChevronLeft size={16} />
        </Link>
      ) : (
        <span aria-hidden className="p-2 text-[#EDE7D6]/15">
          <ChevronLeft size={16} />
        </span>
      )}

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="flex h-9 w-9 items-center justify-center text-[13px] text-[#EDE7D6]/30">
            ···
          </span>
        ) : (
          <Link
            key={page}
            href={href(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`flex h-9 w-9 items-center justify-center text-[14px] transition-colors ${
              page === currentPage
                ? 'text-[#D9B441] underline decoration-[#D9B441] decoration-2 underline-offset-8'
                : 'text-[#EDE7D6]/50 hover:text-[#EDE7D6]'
            }`}
          >
            {page}
          </Link>
        )
      )}

      {currentPage < totalPages ? (
        <Link
          href={href(currentPage + 1)}
          aria-label="다음 페이지"
          className="p-2 text-[#EDE7D6]/45 transition-colors hover:text-[#D9B441]"
        >
          <ChevronRight size={16} />
        </Link>
      ) : (
        <span aria-hidden className="p-2 text-[#EDE7D6]/15">
          <ChevronRight size={16} />
        </span>
      )}
    </nav>
  )
}
