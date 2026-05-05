'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { X, ZoomIn, ZoomOut, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react'

interface PostImageGalleryProps {
  images: { id: string; url: string }[]
}

const MIN_SCALE = 1
const MAX_SCALE = 5
const SCALE_STEP = 0.5

export function PostImageGallery({ images }: PostImageGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // 드래그 상태
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null)
  // 핀치 상태
  const pinchStart = useRef<{ dist: number; scale: number } | null>(null)

  const open = (index: number) => {
    setLightboxIndex(index)
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  const close = () => {
    setLightboxIndex(null)
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  const resetZoom = () => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }

  const zoomIn = () => setScale((s) => Math.min(MAX_SCALE, parseFloat((s + SCALE_STEP).toFixed(1))))
  const zoomOut = () => {
    setScale((s) => {
      const next = Math.max(MIN_SCALE, parseFloat((s - SCALE_STEP).toFixed(1)))
      if (next === 1) setOffset({ x: 0, y: 0 })
      return next
    })
  }

  const prev = () => {
    if (lightboxIndex === null) return
    const next = (lightboxIndex - 1 + images.length) % images.length
    open(next)
  }

  const next = () => {
    if (lightboxIndex === null) return
    open((lightboxIndex + 1) % images.length)
  }

  // 키보드
  useEffect(() => {
    if (lightboxIndex === null) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === '+') zoomIn()
      if (e.key === '-') zoomOut()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightboxIndex, scale])

  // 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = lightboxIndex !== null ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightboxIndex])

  // 마우스 휠 줌
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY < 0 ? SCALE_STEP : -SCALE_STEP
    setScale((s) => {
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, parseFloat((s + delta).toFixed(1))))
      if (next === 1) setOffset({ x: 0, y: 0 })
      return next
    })
  }, [])

  // 마우스 드래그
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return
    e.preventDefault()
    dragStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y }
  }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragStart.current) return
    setOffset({
      x: dragStart.current.ox + e.clientX - dragStart.current.x,
      y: dragStart.current.oy + e.clientY - dragStart.current.y,
    })
  }, [])

  const handleMouseUp = () => { dragStart.current = null }

  // 터치 (핀치 & 드래그)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      pinchStart.current = { dist: Math.hypot(dx, dy), scale }
    } else if (e.touches.length === 1 && scale > 1) {
      dragStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        ox: offset.x,
        oy: offset.y,
      }
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    if (e.touches.length === 2 && pinchStart.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      const dist = Math.hypot(dx, dy)
      const next = Math.min(MAX_SCALE, Math.max(MIN_SCALE, pinchStart.current.scale * (dist / pinchStart.current.dist)))
      setScale(parseFloat(next.toFixed(2)))
      if (next <= 1) setOffset({ x: 0, y: 0 })
    } else if (e.touches.length === 1 && dragStart.current) {
      setOffset({
        x: dragStart.current.ox + e.touches[0].clientX - dragStart.current.x,
        y: dragStart.current.oy + e.touches[0].clientY - dragStart.current.y,
      })
    }
  }

  const handleTouchEnd = () => {
    pinchStart.current = null
    dragStart.current = null
  }

  if (images.length === 0) return null

  const currentUrl = lightboxIndex !== null ? images[lightboxIndex].url : null

  return (
    <>
      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-700 mb-3">첨부 이미지</p>
        <div className="flex flex-wrap gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => open(i)}
              className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 hover:opacity-90 transition-opacity shrink-0"
            >
              <Image src={img.url} alt="" fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      </div>

      {lightboxIndex !== null && currentUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center"
          onClick={close}
        >
          {/* 닫기 */}
          <button
            type="button"
            onClick={close}
            className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors z-10"
          >
            <X size={18} className="text-white" />
          </button>

          {/* 이전/다음 (이미지 여러 장일 때만) */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <ChevronLeft size={22} className="text-white" />
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/25 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <ChevronRight size={22} className="text-white" />
              </button>
            </>
          )}

          {/* 줌 컨트롤 */}
          <div
            className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={zoomOut}
              disabled={scale <= MIN_SCALE}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/15 disabled:opacity-30 transition-colors"
            >
              <ZoomOut size={15} className="text-white" />
            </button>
            <button
              type="button"
              onClick={resetZoom}
              className="text-xs text-white/80 hover:text-white w-10 text-center transition-colors"
            >
              {Math.round(scale * 100)}%
            </button>
            <button
              type="button"
              onClick={zoomIn}
              disabled={scale >= MAX_SCALE}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/15 disabled:opacity-30 transition-colors"
            >
              <ZoomIn size={15} className="text-white" />
            </button>
            {scale > 1 && (
              <button
                type="button"
                onClick={resetZoom}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/15 transition-colors ml-1"
              >
                <RotateCcw size={13} className="text-white/70" />
              </button>
            )}
          </div>

          {/* 이미지 영역 */}
          <div
            className="flex items-center justify-center w-full h-full overflow-hidden"
            style={{ cursor: scale > 1 ? 'grab' : 'default' }}
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={currentUrl}
              alt=""
              draggable={false}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg select-none transition-transform duration-150"
              style={{
                transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
                cursor: scale > 1 ? 'grab' : 'default',
              }}
            />
          </div>

          {/* 이미지 인덱스 표시 */}
          {images.length > 1 && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-xs text-white/60 bg-black/30 rounded-full px-3 py-1">
              {lightboxIndex + 1} / {images.length}
            </div>
          )}
        </div>
      )}
    </>
  )
}
