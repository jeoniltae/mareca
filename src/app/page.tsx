import Link from 'next/link'
import {
  ArrowRight,
  ChevronRight,
  FileText,
  Users,
  Calendar,
  BookOpen,
  MapPin,
  Video,
  ScrollText,
  Megaphone,
  Newspaper,
  Scale,
  MessageSquare,
} from 'lucide-react'
import { HeroSlider } from '@/components/shared/HeroSlider'
import { ComingSoonButton } from '@/components/shared/ComingSoonButton'

// ─── 총회소식 + 일정 + 바로가기 ────────────────────────────────────────────────
function QuickInfoSection() {
  const notices = [
    { title: '부활절연합예배 안내', date: '03-31' },
    { title: '제62회 임시 총회 소집 공고', date: '02-27' },
    { title: '총회 창립 7주년 기념행사', date: '02-14' },
  ]

  const messages = [
    { title: '고난주간을 맞이하며', date: '04-13' },
    { title: '개혁신앙의 본질과 오늘의 교회', date: '03-28' },
    { title: '하나님의 주권과 인간의 책임', date: '03-10' },
  ]

  const quickLinks = [
    { label: '이사장', href: '/about/chairman', icon: Users },
    { label: '자유게시판', href: '/community/free', icon: FileText },
    { label: '갤러리', href: '/community/gallery', icon: Video },
    { label: '총회헌법', href: '/constitution', icon: BookOpen },
  ]

  return (
    <section className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 총회소식 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800 text-base">총회소식</h2>
              <Link
                href="/news"
                className="text-sm text-sky-600 hover:underline flex items-center gap-0.5"
              >
                더보기 <ChevronRight size={14} />
              </Link>
            </div>
            <ul className="space-y-3">
              {notices.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-slate-400 text-sm shrink-0 mt-0.5 tabular-nums">
                    {item.date}
                  </span>
                  <Link
                    href="/news"
                    className="text-base text-slate-600 hover:text-slate-900 line-clamp-1"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 마스터스 메시지 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800 text-base">마스터스 메시지</h2>
              <Link
                href="/community/message"
                className="text-sm text-sky-600 hover:underline flex items-center gap-0.5"
              >
                더보기 <ChevronRight size={14} />
              </Link>
            </div>
            <ul className="space-y-3">
              {messages.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-slate-400 text-sm shrink-0 mt-0.5 tabular-nums">
                    {item.date}
                  </span>
                  <Link
                    href="/community/message"
                    className="text-base text-slate-600 hover:text-slate-900 line-clamp-1"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 바로가기 */}
          <div>
            <h2 className="font-semibold text-slate-800 text-base mb-4">바로가기</h2>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 hover:bg-slate-100 text-base text-slate-700 transition-colors"
                >
                  <item.icon size={16} className="text-sky-600 shrink-0" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 자주찾는 서비스 ────────────────────────────────────────────────────────────
function ServicesSection() {
  const services = [
    { label: '총회의사록', href: '/report/minutes', icon: ScrollText, color: 'text-slate-600 bg-slate-100' },
    { label: '공지사항', href: '/news/notice', icon: Megaphone, color: 'text-sky-600 bg-sky-50' },
    { label: '노회소식', href: '/presbytery/news', icon: Newspaper, color: 'text-emerald-600 bg-emerald-50' },
    { label: '총회헌법', href: '/constitution', icon: Scale, color: 'text-amber-600 bg-amber-50' },
    { label: 'Plus Voice', href: '/community/voice', icon: MessageSquare, color: 'text-violet-600 bg-violet-50' },
    { label: 'ReformedTV', href: '/community/reformed-tv', icon: Video, color: 'text-red-500 bg-red-50' },
  ]

  return (
    <section className="bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-5">
          자주찾는 서비스
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {services.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2.5 py-5 bg-white rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all group"
            >
              <span className={`flex items-center justify-center w-10 h-10 rounded-full ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon size={18} />
              </span>
              <span className="text-sm text-slate-600 group-hover:text-sky-700 font-medium transition-colors text-center leading-tight px-1">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 퀵 메뉴 ────────────────────────────────────────────────────────────────────
function QuickMenuSection() {
  const menus = [
    { label: '오시는 길', href: '/about/directions', icon: MapPin },
    { label: '총회로고', href: '/about/logo', icon: BookOpen },
    { label: '총회헌법', href: '/constitution', icon: FileText },
    { label: '노회소식', href: '/presbytery/news', icon: Users },
    { label: '연혁', href: '/about/history', icon: Calendar },
    { label: '10 Missions', href: '/10-missions', icon: ScrollText },
  ]

  return (
    <section className="bg-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold tracking-widest text-slate-400 uppercase mb-5">
          Quick Menu
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {menus.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2.5 py-5 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors"
            >
              <item.icon size={22} />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 회원교회모집 배너 ──────────────────────────────────────────────────────────
function MembershipBanner() {
  return (
    <section className="bg-sky-600 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-white">
          <h2 className="text-xl font-bold mb-2">
            회원교회모집{' '}
            <span className="font-light italic text-sky-200">Membership</span>
          </h2>
          <p className="text-sky-100 text-base leading-relaxed">
            누구나 멤버가 될 수 있습니다. 그러나 아무나 멤버가 될 수는 없습니다.
            <br className="hidden sm:block" />
            성경의 하나님의 말씀을 믿는 참된 그리스도인을 찾습니다.
          </p>
        </div>
        <ComingSoonButton
          label="총회가입 신청하기"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-white text-sky-700 font-semibold text-base rounded-lg hover:bg-sky-50 transition-colors"
        />
      </div>
    </section>
  )
}

// ─── 포토갤러리 ─────────────────────────────────────────────────────────────────
function GallerySection() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-slate-800 text-lg">포토갤러리</h2>
          <Link
            href="/community/gallery"
            className="text-base text-sky-600 hover:underline flex items-center gap-1"
          >
            더보기 <ChevronRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-video bg-slate-100 rounded-lg flex items-center justify-center text-slate-300 text-sm"
            >
              {/* 실제 이미지로 교체 예정 */}
              사진 {i}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 신학 CTA ────────────────────────────────────────────────────────────────────
function SeminaryCTA() {
  return (
    <section className="bg-slate-50 border-y border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">신학하러 가자</h2>
          <p className="text-slate-500 text-base leading-relaxed max-w-lg">
            예수님을 사랑하고{' '}
            <span className="text-sky-600 font-medium">개혁신학</span>을 배우고 가르치는
            것입니다.
            <br />
            7인의 개혁파 신학교수가 전신합니다. 3년 과정 졸업, 주 학사수 및 학원수
          </p>
        </div>
        <ComingSoonButton
          label="문의하기"
          className="shrink-0 inline-flex items-center gap-2 px-5 py-3 border border-slate-300 text-slate-700 text-base rounded-lg hover:bg-white transition-colors"
        />
      </div>
    </section>
  )
}

// ─── 소개/미션 ──────────────────────────────────────────────────────────────────
function AboutSection() {
  return (
    <section className="relative py-20 bg-slate-900 text-white overflow-hidden">
      {/* 실제 이미지로 교체 예정: /images/about-bg.jpg */}
      <div className="absolute inset-0 bg-[url('/images/about-bg.jpg')] bg-cover bg-center opacity-20" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-5">마스터스가 출발합니다!</h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8">
          우리는 종교개혁의 후손으로서 개혁파 신앙을 고수합니다.
          <br className="hidden sm:block" />
          우리는 성경의 정박지를 벗어난 한국교회를 바로잡고자 합니다.
          <br className="hidden sm:block" />
          우리는 오직 말씀과 사랑으로 한국교회를 섬기고자 합니다.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold text-base rounded-lg hover:bg-slate-100 transition-colors"
        >
          더보기 <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}


// ─── 영상 ────────────────────────────────────────────────────────────────────────
function VideosSection() {
  return (
    <section className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-slate-800 text-lg">ReformedTV</h2>
          <Link
            href="/community/reformed-tv"
            className="text-sm text-sky-600 hover:underline flex items-center gap-1"
          >
            더보기 <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="aspect-video bg-slate-200 rounded-lg flex items-center justify-center text-slate-400"
            >
              <Video size={32} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── 홈 페이지 ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <QuickInfoSection />
      <ServicesSection />
      <QuickMenuSection />
      <MembershipBanner />
      <GallerySection />
      <SeminaryCTA />
      <AboutSection />
      <VideosSection />
    </>
  )
}
