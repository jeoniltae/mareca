// 최더함의 철학시가 전용 히어로 — PageHeader 대신 이 코너만의 톤을 세운다. 목록은 full(대형 타이틀 + 인트로), 상세는 compact

import { Link } from 'next-view-transitions'
import type { BreadcrumbItem } from '@/components/shared/PageHeader'
import { batang, plexMono } from './fonts'

const INTRO = [
  '지금까지 눈으로 보고 읽던 시들을 이젠 AI가 만든 곡조와 함께 귀로 듣고 읽으며 가슴에 담아두는 시가의 시대입니다.',
  "아울러 시가의 내용도 세속적 주제에서 조금 탈피하여 우리의 삶을 철학적 사유와 함께 조망하는, 이른바 '철학시가'라는 새로운 장르를 소개하고자 합니다.",
]

interface PhilosophiaHeroProps {
  breadcrumbs: BreadcrumbItem[]
  /** full = 목록(대형 타이틀 + 우측 인트로), compact = 상세(본문이 주인공이라 히어로를 낮춘다) */
  variant?: 'full' | 'compact'
}

export function PhilosophiaHero({ breadcrumbs, variant = 'full' }: PhilosophiaHeroProps) {
  const isFull = variant === 'full'
  // 목록에서는 코너명이 곧 페이지 제목이라 h1, 상세에서는 게시글 제목이 h1이므로 여기는 일반 텍스트로 낮춘다
  const Title = isFull ? 'h1' : 'p'

  return (
    <section className="relative overflow-hidden bg-[#182B4E] text-[#EDE7D6]">
      {/* 가로 rule 텍스처 — 악보 오선·원고지의 결 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0px,transparent_15px,rgba(237,231,214,0.07)_15px,rgba(237,231,214,0.07)_16px)]"
      />
      {/* 상단 골드 헤어라인 */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D9B441]/50 to-transparent" />

      <div
        className={`relative mx-auto grid max-w-7xl px-4 sm:px-6 lg:px-8 ${
          isFull ? 'gap-12 py-14 sm:py-20 lg:grid-cols-[1.35fr_1fr] lg:gap-0' : 'py-10 sm:py-12'
        }`}
      >
        {/* 타이틀 */}
        <div className={isFull ? 'lg:pr-14' : undefined}>
          <p
            className={`${plexMono.className} text-[13px] tracking-[0.3em] text-[#D9B441] sm:text-[14px] sm:tracking-[0.36em]`}
          >
            철 학 시 가 · PHILOSOPHIA
          </p>

          <Title
            className={`${batang.className} font-bold ${
              isFull
                ? 'mt-6 text-[2.6rem] leading-[1.08] sm:text-6xl lg:text-7xl'
                : 'mt-4 text-3xl leading-tight sm:text-4xl'
            }`}
          >
            최더함의 철학시가
          </Title>

          <div aria-hidden className={`h-px w-20 bg-[#D9B441]/80 ${isFull ? 'mt-8' : 'mt-5'}`} />

          <nav aria-label="breadcrumb" className={isFull ? 'mt-8' : 'mt-5'}>
            <ol
              className={`${plexMono.className} flex flex-wrap items-center gap-3 text-[13px] tracking-[0.12em] text-[#EDE7D6]/60`}
            >
              <li>
                <Link href="/" className="transition-colors hover:text-[#D9B441]">홈</Link>
              </li>
              {breadcrumbs.map((item, i) => {
                const isLast = i === breadcrumbs.length - 1
                return (
                  <li
                    key={i}
                    // 마지막 항목은 게시글 제목이라 길어질 수 있어 모바일에서 감춘다 (PageHeader와 동일한 규칙)
                    className={`flex items-center gap-3 ${isLast && !item.href ? 'hidden sm:flex' : ''}`}
                  >
                    <span aria-hidden className="text-[#EDE7D6]/30">—</span>
                    {item.href ? (
                      <Link href={item.href} className="transition-colors hover:text-[#D9B441]">
                        {item.label}
                      </Link>
                    ) : (
                      <span className="line-clamp-1 text-[#EDE7D6]">{item.label}</span>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>
        </div>

        {/* 인트로 — 목록에서만 */}
        {isFull && (
          <div className="border-t border-[#EDE7D6]/15 pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-14">
            <p className={`${plexMono.className} text-[14px] tracking-[0.14em] text-[#D9B441]`}>
              최더함의 철학시가는…
            </p>

            <ol className="mt-6 space-y-5">
              {INTRO.map((line, i) => (
                <li key={i} className="flex gap-4">
                  <span className={`${plexMono.className} shrink-0 pt-0.5 text-[13px] text-[#D9B441]/80`}>{i + 1}</span>
                  <p className="text-[16px] leading-relaxed text-[#EDE7D6]/85">{line}</p>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}
