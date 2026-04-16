'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type SubItem = {
  label: string
  href: string
}

type NavItem = {
  label: string
  href: string
  subItems?: SubItem[]
}

const NAV_ITEMS: NavItem[] = [
  {
    label: '총회소개',
    href: '/about',
    subItems: [
      { label: '신앙고백', href: '/about/confession' },
      { label: '왜 마스터스개혁파총회를 시작하는가?', href: '/about/reason' },
      { label: '우리는 누구인가?', href: '/about/identity' },
      { label: '이사장', href: '/about/chairman' },
      { label: '연혁 및 주요 행사', href: '/about/history' },
      { label: '총회조직 및 사역원칙', href: '/about/organization' },
      { label: '임원', href: '/about/officers' },
      { label: '교단로고', href: '/about/logo' },
      { label: '오시는 길', href: '/about/directions' },
    ],
  },
  {
    label: '노회소개',
    href: '/presbytery',
    subItems: [
      { label: '노회소식', href: '/presbytery/news' },
      { label: '서울', href: '/presbytery/seoul' },
      { label: '경기', href: '/presbytery/gyeonggi' },
      { label: '제주', href: '/presbytery/jeju' },
      { label: '기타', href: '/presbytery/etc' },
    ],
  },
  {
    label: '총회헌법',
    href: '/constitution',
    subItems: [
      { label: '총회헌법', href: '/constitution/law' },
    ],
  },
  {
    label: '온라인행정',
    href: '/online-admin',
    subItems: [
      { label: '교회계획', href: '/online-admin/plan' },
    ],
  },
  {
    label: '회의보고',
    href: '/report',
    subItems: [
      { label: '총회의사록', href: '/report/minutes' },
    ],
  },
  {
    label: '마스터스자료실',
    href: '/resources',
    subItems: [
      { label: '설교자료실', href: '/resources/sermon' },
      { label: '예배자료실', href: '/resources/worship' },
      { label: '목회자료실', href: '/resources/pastoral' },
      { label: '교육자료실', href: '/resources/education' },
    ],
  },
  {
    label: '소식',
    href: '/news',
    subItems: [
      { label: '소식', href: '/news/all' },
      { label: '공지사항', href: '/news/notice' },
    ],
  },
  {
    label: '커뮤니티',
    href: '/community',
    subItems: [
      { label: '마스터스 메시지', href: '/community/message' },
      { label: '주말인사', href: '/community/greeting' },
      { label: 'Masters Videos', href: '/community/videos' },
      { label: '확정보고', href: '/community/report' },
      { label: '자유게시판', href: '/community/free' },
      { label: '갤러리', href: '/community/gallery' },
      { label: 'Plus Voice', href: '/community/voice' },
      { label: '구인구직', href: '/community/jobs' },
    ],
  },
]

const megaMenuVariants = {
  hidden: { opacity: 0, y: -6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeOut' as const } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.15, ease: 'easeIn' as const } },
}

export function Header() {
  const pathname = usePathname()
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)

  // 페이지 이동 시 모든 메뉴 초기화
  useEffect(() => {
    setIsMenuOpen(false)
    setIsMobileOpen(false)
    setOpenAccordion(null)
  }, [pathname])
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScrollYRef = useRef(0)
  // ref로 isMenuOpen 값을 스크롤 핸들러에서 참조 (클로저 stale 방지)
  const isMenuOpenRef = useRef(false)

  useEffect(() => {
    isMenuOpenRef.current = isMenuOpen
  }, [isMenuOpen])

  useEffect(() => {
    const handleScroll = () => {
      // 메가 메뉴가 열려있으면 헤더 숨김 방지
      if (isMenuOpenRef.current) return

      const currentScrollY = window.scrollY

      // 스크롤 발생 시 모바일 메뉴 초기화
      setIsMobileOpen(false)
      setOpenAccordion(null)

      if (currentScrollY < 10) {
        // 최상단 — 항상 표시
        setIsHeaderVisible(true)
      } else if (currentScrollY > lastScrollYRef.current) {
        // 아래로 스크롤 — 헤더 숨김
        setIsHeaderVisible(false)
      } else {
        // 위로 스크롤 — 헤더 표시
        setIsHeaderVisible(true)
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setIsMenuOpen(true)
  }

  const handleNavMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setIsMenuOpen(false)
    }, 100)
  }

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200"
        animate={{ y: isHeaderVisible ? 0 : '-100%' }}
        transition={{ duration: 0.3, ease: 'easeInOut' as const }}
      >
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
            <div
              className="hidden lg:block"
              onMouseEnter={handleNavMouseEnter}
              onMouseLeave={handleNavMouseLeave}
            >
              <nav className="flex items-center">
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

              {/* 메가 메뉴 */}
              <AnimatePresence>
                {isMenuOpen && (
                  <motion.div
                    key="mega-menu"
                    variants={megaMenuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute left-0 right-0 top-full bg-white border-t border-slate-200 shadow-lg"
                  >
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                      <div className="grid grid-cols-8 gap-4">
                        {NAV_ITEMS.map((item) => (
                          <div key={item.href}>
                            <p className="text-sm font-semibold text-slate-800 mb-3 pb-2 border-b border-slate-100">
                              {item.label}
                            </p>
                            <ul className="space-y-1.5">
                              {item.subItems?.map((sub) => (
                                <li key={sub.href}>
                                  <Link
                                    href={sub.href}
                                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors leading-snug block"
                                  >
                                    {sub.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* 모바일 토글 */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              aria-label="메뉴 열기"
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              key="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto', transition: { duration: 0.2, ease: 'easeOut' as const } }}
              exit={{ opacity: 0, height: 0, transition: { duration: 0.15, ease: 'easeIn' as const } }}
              className="lg:hidden border-t border-slate-100 bg-white overflow-hidden"
            >
              <nav className="max-w-7xl mx-auto px-4 py-2">
                {NAV_ITEMS.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0
                  const isOpen = openAccordion === item.href

                  return (
                    <div key={item.href} className="border-b border-slate-50 last:border-0">
                      {hasSubItems ? (
                        <>
                          {/* 아코디언 토글 버튼 */}
                          <button
                            onClick={() => setOpenAccordion(isOpen ? null : item.href)}
                            className="flex items-center justify-between w-full py-3.5 text-base text-slate-600 hover:text-slate-900 text-left"
                          >
                            {item.label}
                            <motion.span
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.2 }}
                              className="text-slate-400 shrink-0 ml-2"
                            >
                              ▾
                            </motion.span>
                          </button>

                          {/* 서브메뉴 */}
                          <AnimatePresence initial={false}>
                            {isOpen && (
                              <motion.ul
                                key="sub"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1, transition: { duration: 0.2, ease: 'easeOut' as const } }}
                                exit={{ height: 0, opacity: 0, transition: { duration: 0.15, ease: 'easeIn' as const } }}
                                className="overflow-hidden bg-slate-50 rounded-md mb-2"
                              >
                                {item.subItems?.map((sub) => (
                                  <li key={sub.href}>
                                    <Link
                                      href={sub.href}
                                      onClick={() => { setIsMobileOpen(false); setOpenAccordion(null) }}
                                      className="block px-4 py-3 text-sm text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                                    >
                                      {sub.label}
                                    </Link>
                                  </li>
                                ))}
                              </motion.ul>
                            )}
                          </AnimatePresence>
                        </>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className="block py-3.5 text-base text-slate-600 hover:text-slate-900"
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  )
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* 딤드 오버레이 — 메가 메뉴 또는 모바일 메뉴 열릴 때 */}
      <AnimatePresence>
        {(isMenuOpen || isMobileOpen) && (
          <motion.div
            key="dimmed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="fixed inset-0 top-16 z-40 bg-black/40"
            onClick={() => { setIsMenuOpen(false); setIsMobileOpen(false); setOpenAccordion(null) }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* fixed 헤더 높이만큼 공간 확보 */}
      <div className="h-16" aria-hidden="true" />
    </>
  )
}
