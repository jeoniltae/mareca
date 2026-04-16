'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { label: '총회소개', href: '/about' },
  { label: '노회', href: '/presbytery' },
  { label: '총회헌법', href: '/constitution' },
  { label: '온라인행정', href: '/online-admin' },
  { label: '회의보고', href: '/report' },
  { label: '마스터스자료실', href: '/resources' },
  { label: '소식', href: '/news' },
  { label: '커뮤니티', href: '/community' },
]

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-9 h-9 bg-slate-800 rounded flex items-center justify-center text-white text-sm font-bold tracking-tight">
              MRA
            </div>
            <span className="font-semibold text-slate-800 hidden sm:block text-base">
              마스터스개혁파총회
            </span>
          </Link>

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden lg:flex items-center">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-base text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 모바일 토글 */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            aria-label="메뉴 열기"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <nav className="max-w-7xl mx-auto px-4 py-2">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block py-3.5 text-base text-slate-600 hover:text-slate-900 border-b border-slate-50 last:border-0"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
