'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { X, ImagePlus } from 'lucide-react'

const MAX_COUNT = 5
const MAX_SIZE_MB = 5
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

interface ImageAttachmentPreviewProps {
  files: File[]
  onChange: (files: File[]) => void
}

export function ImageAttachmentPreview({ files, onChange }: ImageAttachmentPreviewProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? [])
    const valid = selected.filter((f) => {
      if (!ACCEPTED_TYPES.includes(f.type)) return false
      if (f.size > MAX_SIZE_MB * 1024 * 1024) return false
      return true
    })
    const merged = [...files, ...valid].slice(0, MAX_COUNT)
    onChange(merged)
    e.target.value = ''
  }

  function handleRemove(index: number) {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">
          이미지 첨부 <span className="text-slate-400 font-normal">({files.length}/{MAX_COUNT})</span>
        </span>
        {files.length < MAX_COUNT && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-1.5 text-xs text-sky-600 hover:text-sky-700 border border-sky-200 hover:border-sky-300 rounded-lg px-3 py-1.5 transition-colors"
          >
            <ImagePlus size={14} />
            이미지 추가
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED_TYPES.join(',')}
        multiple
        className="hidden"
        onChange={handleSelect}
      />

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((file, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0">
              <Image
                src={URL.createObjectURL(file)}
                alt={file.name}
                fill
                className="object-cover"
                unoptimized
              />
              <button
                type="button"
                onClick={() => handleRemove(i)}
                className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center transition-colors"
              >
                <X size={10} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-slate-400">JPG, PNG, GIF, WEBP · 최대 {MAX_SIZE_MB}MB · 최대 {MAX_COUNT}장</p>
    </div>
  )
}
