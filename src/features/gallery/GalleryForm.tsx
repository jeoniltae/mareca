'use client'

import { useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uploadGalleryImage, createGalleryPost, updateGalleryPost } from './actions'
import { GalleryImage } from './GalleryImage'

interface GalleryFormProps {
  mode: 'create' | 'edit'
  postId?: string
  initialTitle?: string
  initialDescription?: string
  initialImages?: string[]
}

export function GalleryForm({
  mode,
  postId,
  initialTitle = '',
  initialDescription = '',
  initialImages = [],
}: GalleryFormProps) {
  const router = useRouter()
  const [title, setTitle] = useState(initialTitle)
  const [description, setDescription] = useState(initialDescription)
  const [images, setImages] = useState<string[]>(initialImages)
  const [deletedUrls, setDeletedUrls] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  async function handleFiles(files: FileList) {
    const accepted = Array.from(files).filter((f) => f.type.startsWith('image/'))
    if (accepted.length === 0) return

    setUploading(true)
    setError(null)
    try {
      const urls = await Promise.all(
        accepted.map(async (file) => {
          const fd = new FormData()
          fd.append('file', file)
          return uploadGalleryImage(fd)
        }),
      )
      setImages((prev) => [...prev, ...urls])
    } catch {
      setError('이미지 업로드에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setUploading(false)
    }
  }

  function handleRemove(url: string) {
    setImages((prev) => prev.filter((u) => u !== url))
    if (initialImages.includes(url)) {
      setDeletedUrls((prev) => [...prev, url])
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError('제목을 입력해주세요.')
      return
    }
    setError(null)
    startTransition(async () => {
      try {
        if (mode === 'create') {
          await createGalleryPost(title.trim(), description.trim(), images)
        } else if (mode === 'edit' && postId) {
          await updateGalleryPost(postId, title.trim(), description.trim(), images, deletedUrls)
        }
      } catch (err) {
        if (err instanceof Error && !err.message.includes('NEXT_REDIRECT')) {
          setError(err.message)
        }
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 제목 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition-all"
        />
      </div>

      {/* 설명 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">설명</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="사진에 대한 설명을 입력하세요 (선택)"
          rows={4}
          className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition-all resize-none"
        />
      </div>

      {/* 이미지 업로드 */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          이미지 <span className="text-slate-400 font-normal">(첫 번째 이미지가 대표 이미지로 사용됩니다)</span>
        </label>

        {/* 드래그앤드롭 영역 */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl p-8 text-slate-400 cursor-pointer hover:border-sky-300 hover:text-sky-500 transition-colors"
        >
          {uploading ? (
            <Loader2 size={28} className="animate-spin" />
          ) : (
            <ImagePlus size={28} />
          )}
          <p className="text-sm">{uploading ? '업로드 중...' : '클릭하거나 이미지를 드래그하세요'}</p>
          <p className="text-xs">JPG, PNG, GIF, WEBP 지원</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />
        </div>

        {/* 이미지 미리보기 그리드 */}
        {images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-3">
            {images.map((url, i) => (
              <div key={url} className="relative group aspect-square">
                <GalleryImage
                  src={url}
                  alt={`이미지 ${i + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                {i === 0 && (
                  <span className="absolute bottom-1 left-1 text-[10px] bg-sky-600 text-white px-1.5 py-0.5 rounded font-medium">
                    대표
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(url)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                  aria-label="이미지 삭제"
                >
                  <X size={11} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 오류 메시지 */}
      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-xl">{error}</p>
      )}

      {/* 버튼 */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={isPending || uploading}
          className={cn(
            'px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 rounded-xl hover:bg-sky-700 transition-colors',
            (isPending || uploading) && 'opacity-50 cursor-not-allowed',
          )}
        >
          {isPending ? '저장 중...' : mode === 'create' ? '등록하기' : '수정하기'}
        </button>
      </div>
    </form>
  )
}
