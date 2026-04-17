'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination, Parallax } from 'swiper/modules'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

type Slide = {
  subtitle: string
  title: string
  description: string
}

const SLIDES: Slide[] = [
  {
    subtitle: 'Masters Reformed Assembly',
    title: '마스터스개혁파총회',
    description: '성경의 진리 위에 세워진 개혁파 신앙 공동체',
  },
  {
    subtitle: 'Sola Scriptura · Sola Fide · Sola Gratia',
    title: '오직 말씀, 오직 믿음, 오직 은혜',
    description: '종교개혁의 5대 솔라를 고수하는 순수한 개혁파 신앙',
  },
  {
    subtitle: 'For Korean Church',
    title: '한국교회를 섬깁니다',
    description: '오직 말씀과 사랑으로 한국교회를 바로잡고 세우겠습니다',
  },
]

export function HeroSlider() {
  return (
    <section className="relative h-[60vh] min-h-[420px] overflow-hidden">
      {/* 배경 — Swiper 바깥 단일 레이어, CSS 애니메이션으로 연속 이동 → 슬라이드 경계선 없음 */}
      <div className="absolute inset-0 hero-bg-animate" />
      {/* 하단 어두운 오버레이 */}
      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />

      <Swiper
        className="relative h-full hero-swiper"
        modules={[Parallax, Autoplay, Navigation, Pagination]}
        parallax={true}
        speed={1300}
        loop={true}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
      >
        {SLIDES.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-white px-4">
                {/* 장식 라인 */}
                <div
                  className="w-10 h-px bg-sky-400 mx-auto mb-5"
                  data-swiper-parallax="-200"
                  data-swiper-parallax-opacity="0"
                />
                <p
                  className="text-sm font-semibold tracking-[0.3em] text-sky-300 mb-4 uppercase"
                  data-swiper-parallax="-400"
                  data-swiper-parallax-opacity="0"
                  data-swiper-parallax-scale="0.7"
                >
                  {slide.subtitle}
                </p>
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5"
                  data-swiper-parallax="-650"
                  data-swiper-parallax-opacity="0"
                >
                  {slide.title}
                </h1>
                <p
                  className="text-slate-300 text-base sm:text-lg mx-auto leading-relaxed"
                  data-swiper-parallax="-900"
                  data-swiper-parallax-opacity="0"
                  data-swiper-parallax-scale="0.85"
                >
                  {slide.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}
