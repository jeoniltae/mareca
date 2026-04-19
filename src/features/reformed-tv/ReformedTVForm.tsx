'use client'

import { useState, useTransition } from 'react'
import { Link2 } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { extractYoutubeId, getYoutubeThumbnail } from '@/features/youtube/youtube-utils'
import { createReformedTVPost, updateReformedTVPost } from './actions'

interface ReformedTVFormProps {
  mode: 'create' | 'edit'
  postId?: string
  initialValues?: {
    title: string
    youtube_url: string | null
    description: string | null
  }
  cancelHref: string
}

export function ReformedTVForm({ mode, postId, initialValues, cancelHref }: ReformedTVFormProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [youtubeUrl, setYoutubeUrl] = useState(initialValues?.youtube_url ?? '')

  const videoId = extractYoutubeId(youtubeUrl)
  const thumbnailUrl = videoId ? getYoutubeThumbnail(videoId) : null

  async function handleSubmit(formData: FormData) {
    if (!youtubeUrl.trim()) {
      setError('유튜브 URL을 입력해주세요.')
      return
    }
    if (!videoId) {
      setError('올바른 유튜브 URL을 입력해주세요.')
      return
    }
    setError(null)

    startTransition(async () => {
      try {
        if (mode === 'edit' && postId) {
          await updateReformedTVPost(postId, formData)
        } else {
          await createReformedTVPost(formData)
        }
      } catch {
        setError('저장 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* 유튜브 URL */}
      <div>
        <label className="text-sm font-medium text-slate-700 block mb-1.5">
          유튜브 URL <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <Link2 size={18} className="text-red-500 shrink-0" />
          <input
            name="youtube_url"
            type="url"
            required
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
        {thumbnailUrl && (
          <div className="mt-3">
            <p className="text-xs text-slate-500 mb-1.5">미리보기</p>
            <img
              src={thumbnailUrl}
              alt="YouTube 썸네일"
              className="w-48 rounded-lg border border-slate-200"
            />
          </div>
        )}
      </div>

      {/* 제목 */}
      <div>
        <label className="text-sm font-medium text-slate-700 block mb-1.5">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          name="title"
          type="text"
          required
          defaultValue={initialValues?.title}
          placeholder="영상 제목을 입력하세요"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
        />
      </div>

      {/* 설명 */}
      <div>
        <label className="text-sm font-medium text-slate-700 block mb-1.5">
          설명 <span className="text-slate-400 font-normal text-xs">(선택)</span>
        </label>
        <textarea
          name="description"
          rows={4}
          defaultValue={initialValues?.description ?? ''}
          placeholder="영상에 대한 설명을 입력하세요"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none"
        />
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="flex items-center justify-end gap-3 pt-2">
        <Link
          href={cancelHref}
          className="px-5 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          취소
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            'px-5 py-2.5 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors',
            isPending && 'opacity-60 cursor-not-allowed',
          )}
        >
          {isPending ? '저장 중...' : mode === 'edit' ? '수정 완료' : '등록'}
        </button>
      </div>
    </form>
  )
}
