'use client'

import { useState, useRef, useEffect } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryImageProps {
  src: string
  alt: string
  className?: string
}

export function GalleryImage({ src, alt, className }: GalleryImageProps) {
  const [broken, setBroken] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    // React onError가 붙기 전에 이미 로드 실패한 경우를 캐치
    const img = imgRef.current
    if (img && img.complete && img.naturalWidth === 0) {
      setBroken(true)
    }
  }, [])

  if (broken) {
    return (
      <div
        className={cn(
          'w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-100 text-slate-300',
          className,
        )}
      >
        <ImageOff size={32} strokeWidth={1.5} />
        <span className="text-xs text-slate-400">이미지를 불러올 수 없습니다</span>
      </div>
    )
  }

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={className}
      onError={() => setBroken(true)}
    />
  )
}
