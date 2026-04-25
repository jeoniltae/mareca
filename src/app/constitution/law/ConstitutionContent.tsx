'use client'

import { useState, useEffect, useRef } from 'react'
import { ConstitutionSection } from './law-data'
import { ConstitutionArticle } from './ConstitutionArticle'

interface ConstitutionContentProps {
  section: ConstitutionSection
}

export function ConstitutionContent({ section }: ConstitutionContentProps) {
  const [activeChapter, setActiveChapter] = useState(section.chapters[0].number)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const isScrollingRef = useRef(false)
  const navRef = useRef<HTMLElement>(null)
  const sheetNavRef = useRef<HTMLDivElement>(null)

  const uniqueChapters = section.chapters.filter(
    (ch, idx, arr) => arr.findIndex(c => c.number === ch.number && c.title === ch.title) === idx
  )

  // 활성 챕터가 바뀌면 TOC 항상 해당 버튼 중앙 정렬
  useEffect(() => {
    const scrollNavToActive = (nav: HTMLElement | null) => {
      if (!nav) return
      const activeBtn = nav.querySelector<HTMLElement>('[data-active="true"]')
      if (!activeBtn) return
      nav.scrollTo({
        top: activeBtn.offsetTop - nav.clientHeight / 2 + activeBtn.offsetHeight / 2,
        behavior: 'smooth',
      })
    }
    scrollNavToActive(navRef.current)
    scrollNavToActive(sheetNavRef.current)
  }, [activeChapter])

  useEffect(() => {
    const observers: IntersectionObserver[] = []

    section.chapters.forEach((chapter) => {
      const el = document.getElementById(`chapter-${chapter.number}-${chapter.title}`)
      if (!el) return

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !isScrollingRef.current) {
            setActiveChapter(chapter.number)
          }
        },
        { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
      )

      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((obs) => obs.disconnect())
  }, [section])

  // 바텀 시트 열릴 때 body 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = isSheetOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isSheetOpen])

  const scrollToChapter = (chapterNumber: string, chapterTitle: string, closeSheet = false) => {
    isScrollingRef.current = true
    setActiveChapter(chapterNumber)
    if (closeSheet) setIsSheetOpen(false)
    const el = document.getElementById(`chapter-${chapterNumber}-${chapterTitle}`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setTimeout(() => { isScrollingRef.current = false }, 800)
  }

  const activeChapterTitle = uniqueChapters.find(ch => ch.number === activeChapter)?.title ?? ''

  const TocList = ({ onSelect }: { onSelect: (num: string, title: string) => void }) => (
    <>
      {uniqueChapters.map((ch) => (
        <button
          key={`${ch.number}-${ch.title}`}
          data-active={activeChapter === ch.number ? 'true' : 'false'}
          onClick={() => onSelect(ch.number, ch.title)}
          className={`w-full text-left text-xs px-3 py-2 rounded-md transition-colors leading-snug ${
            activeChapter === ch.number
              ? 'bg-slate-800 text-white font-semibold'
              : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
          }`}
        >
          <span className="block text-[11px] opacity-70">{ch.number}</span>
          {ch.title}
        </button>
      ))}
    </>
  )

  return (
    <>
      <div className="flex gap-8">
        {/* 사이드바 TOC — 데스크탑만 표시 */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-32 flex flex-col" style={{ maxHeight: 'calc(100vh - 8rem)' }}>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 shrink-0">목차</p>
            <nav ref={navRef} className="space-y-1 overflow-y-auto scrollbar-hide">
              <TocList onSelect={(num, title) => scrollToChapter(num, title)} />
            </nav>
          </div>
        </aside>

        {/* 본문 */}
        <div className="flex-1 min-w-0 space-y-12">
          {section.preamble && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-5">
              <p className="text-sm text-amber-900 leading-relaxed">{section.preamble}</p>
            </div>
          )}

          {section.chapters.map((chapter) => (
            <section
              key={`${chapter.number}-${chapter.title}`}
              id={`chapter-${chapter.number}-${chapter.title}`}
              className="scroll-mt-32"
            >
              <div className="flex items-center gap-3 mb-5">
                <span className="text-xs font-bold text-white bg-slate-700 px-2.5 py-1 rounded">
                  {chapter.number}
                </span>
                <h2 className="text-lg font-bold text-slate-800">{chapter.title}</h2>
              </div>
              <div className="space-y-3">
                {chapter.articles.map((article) => (
                  <ConstitutionArticle key={article.number} article={article} />
                ))}
              </div>
            </section>
          ))}

          {section.addendum && (
            <section className="border-t border-slate-200 pt-8">
              <h2 className="text-base font-bold text-slate-700 mb-4">부칙</h2>
              <div className="space-y-2">
                {section.addendum.map((item, i) => (
                  <p key={i} className="text-sm text-slate-500 leading-relaxed">{item}</p>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* FAB — 모바일만 표시 */}
      <button
        onClick={() => setIsSheetOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-30 flex items-center gap-2 bg-slate-800 text-white text-xs font-semibold px-4 py-3 rounded-full shadow-lg active:scale-95 transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h10" />
        </svg>
        목차
      </button>

      {/* 바텀 시트 오버레이 */}
      {isSheetOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/40"
          onClick={() => setIsSheetOpen(false)}
        />
      )}

      {/* 바텀 시트 */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl transition-transform duration-300 ${
          isSheetOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '70vh' }}
      >
        {/* 핸들 */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-slate-300" />
        </div>

        {/* 헤더 */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
          <div>
            <p className="text-xs text-slate-400 font-medium">현재 위치</p>
            <p className="text-sm font-bold text-slate-700">{activeChapter} {activeChapterTitle}</p>
          </div>
          <button
            onClick={() => setIsSheetOpen(false)}
            className="text-slate-400 hover:text-slate-600 p-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 목차 리스트 */}
        <div ref={sheetNavRef} className="overflow-y-auto scrollbar-hide px-4 py-3" style={{ maxHeight: 'calc(70vh - 5rem)' }}>
          <div className="space-y-1">
            <TocList onSelect={(num, title) => scrollToChapter(num, title, true)} />
          </div>
        </div>
      </div>
    </>
  )
}
