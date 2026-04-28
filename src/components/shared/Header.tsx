'use client'

import { useState, useRef, useEffect, useLayoutEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogIn, LogOut, User, CheckCircle2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase'
import type { User as SupabaseUser } from '@supabase/supabase-js'

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
      { label: '총회로고', href: '/about/logo' },
      { label: '총회헌법', href: '/constitution' },
      { label: '오시는 길', href: '/about/directions' },
    ],
  },
  {
    label: '10 Missions',
    href: '/10-missions',
    subItems: [
      { label: '소개', href: '/10-missions' },
    ],
  },
  {
    label: '클럽소식',
    href: '/club-news',
    subItems: [
      { label: '소식', href: '/club-news/news' },
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
      { label: 'ReformedTV', href: '/community/reformed-tv' },
      { label: '자유게시판', href: '/community/free' },
      { label: '갤러리', href: '/community/gallery' },
      { label: 'Plus Voice', href: '/community/voice' },
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
  const router = useRouter()
  const [isHeaderVisible, setIsHeaderVisible] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  const [user, setUser] = useState<SupabaseUser | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showLogoutToast, setShowLogoutToast] = useState(false)

  const handleLogout = () => setShowLogoutConfirm(true)

  const handleLogoutConfirm = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    setShowLogoutConfirm(false)
    setShowLogoutToast(true)
    setTimeout(() => setShowLogoutToast(false), 2500)
    router.refresh()
  }

  // refs는 이를 사용하는 effect보다 먼저 선언
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastScrollYRef = useRef(0)
  const isMenuOpenRef = useRef(false)
  const isNavigatingRef = useRef(false)

  useEffect(() => {
    isMenuOpenRef.current = isMenuOpen
  }, [isMenuOpen])

  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  // useLayoutEffect: 페인트 전에 실행 → Next.js 스크롤 복원(useEffect)보다 먼저 가드 설정
  // useEffect는 자식→부모 순서라 page의 스크롤 복원 effect가 Header effect보다 먼저 실행됨
  // useLayoutEffect는 페인트 전 실행이므로 스크롤 복원 전에 isNavigatingRef를 true로 설정 가능
  useLayoutEffect(() => {
    isNavigatingRef.current = true
    setIsMenuOpen(false)
    setIsMobileOpen(false)
    setOpenAccordion(null)
    setIsHeaderVisible(true)

    const timer = setTimeout(() => {
      lastScrollYRef.current = window.scrollY
      isNavigatingRef.current = false
    }, 150)

    return () => clearTimeout(timer)
  }, [pathname])

  // bfcache 복원 감지 — 복원 시 강제 리로드로 Framer Motion 재초기화
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload()
      }
    }
    window.addEventListener('pageshow', handlePageShow)
    return () => window.removeEventListener('pageshow', handlePageShow)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      // 메가 메뉴 열림 또는 페이지 전환 직후면 무시
      if (isMenuOpenRef.current || isNavigatingRef.current) return

      const currentScrollY = window.scrollY

      if (currentScrollY < 10) {
        setIsHeaderVisible(true)
      } else if (currentScrollY > lastScrollYRef.current) {
        setIsHeaderVisible(false)
      } else {
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
              <img src="/images/logo.jpg" alt="마스터스개혁파총회 로고" width={65} height={65} className="rounded object-cover" />
              <span className="font-semibold text-slate-800 text-[24px] sm:text-[20px]">
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
                    className="relative px-3 py-2 text-base font-medium text-slate-800 hover:text-slate-700 transition-colors after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-0.5 after:w-0 after:bg-slate-700 after:transition-all after:duration-300 hover:after:w-full"
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
                                    className="text-sm text-slate-500 hover:text-[#3C5A6E] hover:font-medium hover:translate-x-1 transition-all leading-snug block"
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

            {/* 데스크탑 로그인/유저 버튼 */}
            <div className="hidden lg:flex items-center">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-300 hover:border-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                >
                  <User size={15} />
                  <span className="max-w-[150px] truncate">{user.email?.split('@')[0]}</span>
                  <LogOut size={14} className="text-slate-400" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-300 hover:border-slate-500 hover:text-slate-800 rounded-lg transition-colors"
                >
                  <LogIn size={15} />
                  로그인
                </Link>
              )}
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

      </motion.header>

      {/* 딤드 오버레이 — 데스크탑 메가 메뉴 열릴 때 */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="dimmed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="fixed inset-0 top-16 z-40 bg-black/40"
            onClick={() => { setIsMenuOpen(false); setOpenAccordion(null) }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* 모바일 메뉴 — 헤더 아래 고정 패널 (자체 스크롤) */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.2 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="fixed top-16 left-0 right-0 bottom-0 z-40 bg-white overflow-y-auto lg:hidden"
          >
            <nav className="max-w-7xl mx-auto px-4 py-2">
              {/* 모바일 로그인/로그아웃 */}
              <div className="border-b border-slate-100 py-3">
                {user ? (
                  <button
                    onClick={() => { handleLogout(); setIsMobileOpen(false) }}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    <User size={15} />
                    <span>{user.email?.split('@')[0]}</span>
                    <LogOut size={14} className="text-slate-400 ml-1" />
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileOpen(false)}
                    className="flex items-center gap-2 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    <LogIn size={15} />
                    로그인
                  </Link>
                )}
              </div>

              {NAV_ITEMS.map((item) => {
                const hasSubItems = item.subItems && item.subItems.length > 0
                const isOpen = openAccordion === item.href

                return (
                  <div key={item.href} className="border-b border-slate-50 last:border-0">
                    {hasSubItems ? (
                      <>
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

      {/* fixed 헤더 높이만큼 공간 확보 */}
      <div className="h-16" aria-hidden="true" />

      {/* 로그아웃 성공 토스트 */}
      <AnimatePresence>
        {showLogoutToast && (
          <motion.div
            key="logout-toast"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="fixed top-20 left-1/2 z-50 -translate-x-1/2 flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-slate-900 text-white text-sm font-medium shadow-xl"
          >
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            로그아웃 되었습니다
          </motion.div>
        )}
      </AnimatePresence>

      {/* 로그아웃 확인 모달 */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <>
            <motion.div
              key="logout-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setShowLogoutConfirm(false)}
              aria-hidden="true"
            />
            <motion.div
              key="logout-modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-xl"
            >
              <h2 className="text-base font-semibold text-slate-900 mb-1">로그아웃</h2>
              <p className="text-sm text-slate-500 mb-6">정말 로그아웃 하시겠어요?</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleLogoutConfirm}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-semibold text-white hover:bg-red-600 transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
