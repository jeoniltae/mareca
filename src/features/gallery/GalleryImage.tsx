'use client'

import { useState } from 'react'
import { ImageOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface GalleryImageProps {
  src: string
  alt: string
  className?: string
}

export function GalleryImage({ src, alt, className }: GalleryImageProps) {
  const [broken, setBroken] = useState(false)

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
      src={src}
      alt={alt}
      className={className}
      onError={() => setBroken(true)}
    />
  )
}
