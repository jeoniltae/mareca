'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface PostImageGalleryProps {
  images: { id: string; url: string }[]
}

export function PostImageGallery({ images }: PostImageGalleryProps) {
  const [lightbox, setLightbox] = useState<string | null>(null)

  useEffect(() => {
    document.body.style.overflow = lightbox ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [lightbox])

  if (images.length === 0) return null

  return (
    <>
      <div className="mt-6">
        <p className="text-sm font-semibold text-slate-700 mb-3">첨부 이미지</p>
        <div className="flex flex-wrap gap-2">
          {images.map((img) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setLightbox(img.url)}
              className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 hover:opacity-90 transition-opacity shrink-0"
            >
              <Image src={img.url} alt="" fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
          >
            <X size={18} className="text-white" />
          </button>
          <div
            className="flex items-center justify-center w-full max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightbox}
              alt=""
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </>
  )
}
