'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import { GalleryImage } from './GalleryImage'

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
      className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
      onError={() => setBroken(true)}
    />
  )
}

export function GalleryImageViewer({ images }: GalleryImageViewerProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const isOpen = lightboxIndex !== null

  function openAt(i: number) {
    setLightboxIndex(i)
  }

  function close() {
    setLightboxIndex(null)
  }

  function prev() {
    setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : null))
  }

  function next() {
    setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : null))
  }

  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
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

            {/* 이미지 */}
            <motion.div
              key={`lb-img-${lightboxIndex}`}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 28 } }}
              exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.15 } }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none px-16"
            >
              <LightboxImage
                src={images[lightboxIndex]}
                alt={`이미지 ${lightboxIndex + 1}`}
              />
            </motion.div>

            {/* 이전 버튼 */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="fixed left-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="이전 이미지"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            {/* 다음 버튼 */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next() }}
                className="fixed right-3 top-1/2 -translate-y-1/2 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                aria-label="다음 이미지"
              >
                <ChevronRight size={22} />
              </button>
            )}

            {/* 인디케이터 */}
            {images.length > 1 && (
              <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === lightboxIndex ? 'bg-white scale-125' : 'bg-white/40 hover:bg-white/70'
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
