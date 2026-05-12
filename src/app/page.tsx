import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '마스터스개혁파총회',
  description: '마스터스개혁파총회(MRA)는 개혁주의 신앙과 성경의 진리 위에 세워진 한국 개혁파 교회 총회입니다. 총회 소식, 신앙 자료, 교회 공동체 정보를 제공합니다.',
}
import { formatMonthDay } from '@/lib/date'
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
  Feather,
  Image as ImageIcon,
  Play,
  MessageSquare,
  Mail,
} from 'lucide-react'
import { HeroSlider } from '@/components/shared/HeroSlider'
import { ComingSoonButton } from '@/components/shared/ComingSoonButton'
import { createClient } from '@/lib/supabase-server'
import { extractYoutubeId, getYoutubeThumbnail } from '@/features/youtube/youtube-utils'

// ─── 총회소식 + 일정 + 바로가기 ────────────────────────────────────────────────
async function QuickInfoSection() {
  const supabase = await createClient()

  const [{ data: newsPosts }, { data: notices }, { data: pressArticles }] = await Promise.all([
    supabase
      .from('posts')
      .select('id, title, created_at')
      .eq('board', 'news')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('posts')
      .select('id, title, created_at')
      .eq('board', 'notice')
      .order('created_at', { ascending: false })
      .limit(3),
    supabase
      .from('press_articles')
      .select('id, og_title, source_name, published_at')
      .order('published_at', { ascending: false })
      .limit(3),
  ])

  return (
    <section className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* 총회소식 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800 text-base">총회소식</h2>
              <Link
                href="/news/all"
                className="text-sm text-sky-600 hover:underline flex items-center gap-0.5"
              >
                더보기 <ChevronRight size={14} />
              </Link>
            </div>
            <ul className="space-y-3">
              {(newsPosts ?? []).length === 0 ? (
                <li className="text-sm text-slate-400">등록된 게시물이 없습니다.</li>
              ) : (newsPosts ?? []).map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="text-slate-400 text-sm shrink-0 mt-0.5 tabular-nums">
                    {formatMonthDay(item.created_at)}
                  </span>
                  <Link
                    href={`/news/all/${item.id}`}
                    className="text-base text-slate-600 hover:text-slate-900 line-clamp-1"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 공지사항 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800 text-base">공지사항</h2>
              <Link
                href="/news/notice"
                className="text-sm text-sky-600 hover:underline flex items-center gap-0.5"
              >
                더보기 <ChevronRight size={14} />
              </Link>
            </div>
            <ul className="space-y-3">
              {(notices ?? []).length === 0 ? (
                <li className="text-sm text-slate-400">등록된 게시물이 없습니다.</li>
              ) : (notices ?? []).map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="text-slate-400 text-sm shrink-0 mt-0.5 tabular-nums">
                    {formatMonthDay(item.created_at)}
                  </span>
                  <Link
                    href={`/news/notice/${item.id}`}
                    className="text-base text-slate-600 hover:text-slate-900 line-clamp-1"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 관련기사 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-slate-800 text-base">관련기사</h2>
              <Link
                href="/news/press"
                className="text-sm text-sky-600 hover:underline flex items-center gap-0.5"
              >
                더보기 <ChevronRight size={14} />
              </Link>
            </div>
            <ul className="space-y-3">
              {(pressArticles ?? []).length === 0 ? (
                <li className="text-sm text-slate-400">등록된 기사가 없습니다.</li>
              ) : (pressArticles ?? []).map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="text-slate-400 text-sm shrink-0 mt-0.5 tabular-nums">
                    {item.published_at ? formatMonthDay(item.published_at) : '--'}
                  </span>
                  <Link
                    href={`/news/press/${item.id}`}
                    className="text-base text-slate-600 hover:text-slate-900 line-clamp-1"
                  >
                    {item.og_title ?? '제목 없음'}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── 자주찾는 서비스 ────────────────────────────────────────────────────────────
function ServicesSection() {
  const services = [
    { label: '선언문', href: '/vision/declaration', icon: Feather, color: 'text-slate-600 bg-slate-100' },
    { label: '신앙고백', href: '/about/confession', icon: BookOpen, color: 'text-sky-600 bg-sky-50' },
    { label: '임원', href: '/about/officers', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
    { label: '마스터스 메시지', href: '/community/message', icon: Mail, color: 'text-amber-600 bg-amber-50' },
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
    { label: '마스터스 클럽소식', href: '/club-news/news', icon: Users },
    { label: '연혁', href: '/about/history', icon: Calendar },
    { label: '10 Missions', href: '/vision', icon: ScrollText },
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
              <span className="text-sm text-center px-1 leading-tight">
                {item.label === '마스터스 클럽소식'
                  ? <><span className="sm:hidden">마스터스<br />클럽소식</span><span className="hidden sm:inline">마스터스 클럽소식</span></>
                  : item.label}
              </span>
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
async function GallerySection() {
  const supabase = await createClient()
  const { data: albums } = await supabase
    .from('posts')
    .select('id, title, thumbnail_url')
    .eq('board', 'gallery')
    .order('created_at', { ascending: false })
    .limit(4)

  const slots = Array.from({ length: 4 }, (_, i) => albums?.[i] ?? null)

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-slate-800 text-lg">총회 행사앨범</h2>
          <Link
            href="/community/album"
            className="text-base text-sky-600 hover:underline flex items-center gap-1"
          >
            더보기 <ChevronRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {slots.map((album, i) =>
            album ? (
              <Link
                key={album.id}
                href={`/community/album/${album.id}`}
                className="group relative aspect-video rounded-lg overflow-hidden bg-slate-100"
              >
                <img
                  src={album.thumbnail_url ?? ''}
                  alt={album.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-xs font-medium line-clamp-1">{album.title}</p>
                </div>
              </Link>
            ) : (
              <div
                key={i}
                className="aspect-video rounded-lg bg-slate-100 flex flex-col items-center justify-center gap-2 text-slate-300"
              >
                <ImageIcon size={24} />
                <span className="text-xs">게시물이 없습니다</span>
              </div>
            )
          )}
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
async function VideosSection() {
  const supabase = await createClient()
  const { data: videos } = await supabase
    .from('posts')
    .select('id, title, youtube_url')
    .eq('board', 'reformed-tv')
    .order('created_at', { ascending: false })
    .limit(3)

  const slots = Array.from({ length: 3 }, (_, i) => videos?.[i] ?? null)

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
          {slots.map((video, i) => {
            const videoId = video?.youtube_url ? extractYoutubeId(video.youtube_url) : null
            const thumbnail = videoId ? getYoutubeThumbnail(videoId) : null
            return video && thumbnail ? (
              <Link
                key={video.id}
                href={`/community/reformed-tv/${video.id}`}
                className="group relative aspect-video rounded-lg overflow-hidden bg-slate-800"
              >
                <img
                  src={thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-black/60 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all">
                    <Play size={20} className="text-white ml-1" fill="white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/70 to-transparent">
                  <p className="text-white text-xs font-medium line-clamp-1">{video.title}</p>
                </div>
              </Link>
            ) : (
              <div
                key={i}
                className="aspect-video rounded-lg bg-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400"
              >
                <Video size={28} />
                <span className="text-xs">게시물이 없습니다</span>
              </div>
            )
          })}
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
