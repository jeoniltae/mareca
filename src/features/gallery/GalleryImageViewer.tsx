'use client'

import { useState, useEffect, useRef } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Keyboard, Zoom } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import { GalleryImage } from './GalleryImage'

import 'swiper/css'
import 'swiper/css/zoom'

interface GalleryImageViewerProps {
  images: string[]
}

function LightboxImage({ src, alt }: { src: string; alt: string }) {
  const [broken, setBroken] = useState(false)

  if (broken) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 w-80 h-60 rounded-xl bg-white/10 text-white/60">
        <ImageOff size={36} strokeWidth={1.5} />
        <span className="text-sm">이미지를 불러올 수 없습니다</span>
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
      onError={() => setBroken(true)}
    />
  )
}

export function GalleryImageViewer({ images }: GalleryImageViewerProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const swiperRef = useRef<SwiperType | null>(null)

  const isOpen = lightboxIndex !== null

  function openAt(i: number) {
    setActiveIndex(i)
    setLightboxIndex(i)
  }

  function close() {
    setLightboxIndex(null)
  }

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (images.length === 0) return null

  return (
    <>
      {/* 이미지 그리드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {images.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => openAt(i)}
            className="relative aspect-square overflow-hidden rounded-xl group focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <GalleryImage
              src={url}
              alt={`이미지 ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        ))}
      </div>

      {/* 라이트박스 */}
      <AnimatePresence>
        {isOpen && lightboxIndex !== null && (
          <>
            {/* 백드롭 */}
            <motion.div
              key="lb-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/90"
              onClick={close}
            />

            {/* 닫기 버튼 */}
            <button
              type="button"
              onClick={close}
              className="fixed top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="닫기"
            >
              <X size={20} />
            </button>

            {/* Swiper */}
            <motion.div
              key="lb-swiper"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 28 } }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.15 } }}
              className="fixed inset-0 z-50 flex items-center justify-center"
              onClick={close}
            >
              <div
                className="w-full sm:px-14"
                onClick={(e) => e.stopPropagation()}
              >
                <Swiper
                  key={lightboxIndex}
                  modules={[Keyboard, Zoom]}
                  initialSlide={lightboxIndex}
                  keyboard={{ enabled: true }}
                  zoom={{ maxRatio: 4, minRatio: 1 }}
                  loop={images.length > 1}
                  onSwiper={(swiper) => { swiperRef.current = swiper }}
                  onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                  className="w-full"
                >
                  {images.map((url, i) => (
                    <SwiperSlide key={url}>
                      <div className="flex items-center justify-center h-[80vh] px-4">
                        <div className="swiper-zoom-container">
                          <LightboxImage src={url} alt={`이미지 ${i + 1}`} />
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </motion.div>

            {/* 이전/다음 버튼 — 데스크탑만 표시 */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="hidden sm:flex fixed left-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="이전 이미지"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slideNext()}
                  className="hidden sm:flex fixed right-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="다음 이미지"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* 페이징 점 — 모바일·데스크탑 모두 표시 */}
            {images.length > 1 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => swiperRef.current?.slideTo(i)}
                    className={`rounded-full transition-all duration-200 ${
                      i === activeIndex
                        ? 'w-2.5 h-2.5 bg-white'
                        : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`이미지 ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </AnimatePresence>
    </>
  )
}
