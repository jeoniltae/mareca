'use client'
// 리폼드북스 섹션 네비게이션 — 모바일 수평 탭 바(BookTOCBar) & PC 사이드바(BookTOCSidebar)

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface TocItem {
  id: string
  label: string
}

function useTOC(sections: TocItem[]) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? '')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length > 0) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-10% 0px -80% 0px', threshold: 0 },
    )
    sections.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [sections])

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const offset = 76
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' })
  }

  return { activeId, scrollTo }
}

export function BookTOCBar({ sections }: { sections: TocItem[] }) {
  const { activeId, scrollTo } = useTOC(sections)
  const tabsRef = useRef<HTMLDivElement>(null)
  const [headerVisible, setHeaderVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY
      if (current < 10) {
        setHeaderVisible(true)
      } else if (current > lastScrollY.current) {
        setHeaderVisible(false)
      } else {
        setHeaderVisible(true)
      }
      lastScrollY.current = current
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const active = tabsRef.current?.querySelector(`[data-id="${activeId}"]`) as HTMLElement | null
    active?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
  }, [activeId])

  return (
    <div
      className="lg:hidden sticky z-30 bg-white border-b border-slate-200 shadow-sm transition-[top] duration-300"
      style={{ top: headerVisible ? '64px' : '0px' }}
    >
      <div ref={tabsRef} className="flex gap-2 px-4 py-2.5 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            data-id={id}
            onClick={() => scrollTo(id)}
            className={cn(
              'shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
              activeId === id
                ? 'bg-slate-800 text-white'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-slate-400 hover:text-slate-700',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function BookTOCSidebar({ sections }: { sections: TocItem[] }) {
  const { activeId, scrollTo } = useTOC(sections)

  return (
    <div className="hidden lg:block">
      <div className="sticky top-24 space-y-0.5">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">목차</p>
        {sections.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => scrollTo(id)}
            className={cn(
              'w-full flex items-center gap-2.5 text-left py-1.5 px-2 rounded-lg text-sm transition-colors',
              activeId === id
                ? 'text-slate-800 font-medium'
                : 'text-slate-400 hover:text-slate-600',
            )}
          >
            <span
              className={cn(
                'shrink-0 w-2 h-2 rounded-full transition-colors',
                activeId === id ? 'bg-slate-800' : 'bg-slate-300',
              )}
            />
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
