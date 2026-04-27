'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { PostEditor } from './PostEditor'
import { AttachmentSection } from './AttachmentSection'
import { ExistingImage } from './ImageAttachmentPreview'
import { ExistingAttachment } from './FileAttachmentList'
import {
  createPost,
  updatePost,
  uploadPostImage,
  insertPostImages,
  uploadPostAttachment,
  insertPostAttachments,
} from './actions'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const CATEGORIES = ['일반', '질문', '나눔'] as const

interface PostFormProps {
  mode: 'create' | 'edit'
  postId?: string
  initialValues?: {
    title: string
    category: string
    content: string
    youtube_url: string | null
  }
  initialImages?: ExistingImage[]
  initialAttachments?: ExistingAttachment[]
  cancelHref: string
}

export function PostForm({ mode, postId, initialValues, initialImages, initialAttachments, cancelHref }: PostFormProps) {
  const router = useRouter()
  const [content, setContent] = useState(initialValues?.content ?? '')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([])
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    if (!content.trim() || content === '<p></p>') {
      setError('내용을 입력해주세요.')
      return
    }
    setError(null)
    formData.set('content', content)

    startTransition(async () => {
      try {
        const targetId = mode === 'edit' && postId
          ? (await updatePost(postId, formData), postId)
          : await createPost(formData)

        // 이미지 업로드 (파일별 FormData)
        const imageUrls = await Promise.all(
          imageFiles.map((file, i) => {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('order', String(i))
            return uploadPostImage(fd)
          })
        )
        // 파일 업로드 (파일별 FormData)
        const attachmentMetas = await Promise.all(
          attachmentFiles.map((file) => {
            const fd = new FormData()
            fd.append('file', file)
            return uploadPostAttachment(fd)
          })
        )

        await Promise.all([
          insertPostImages(targetId, imageUrls),
          insertPostAttachments(targetId, attachmentMetas),
        ])

        router.push(`/community/free/${targetId}`)
      } catch (error) {
        if ((error as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw error
        setError('저장 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* 카테고리 */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700 shrink-0 w-16">분류</label>
        <select
          name="category"
          defaultValue={initialValues?.category ?? '일반'}
          className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* 제목 */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700 shrink-0 w-16">제목</label>
        <input
          name="title"
          type="text"
          required
          defaultValue={initialValues?.title}
          placeholder="제목을 입력하세요"
          className="flex-1 min-w-0 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
        />
      </div>

      {/* 본문 에디터 */}
      <div>
        <label className="text-sm font-medium text-slate-700 block mb-2">내용</label>
        <PostEditor initialContent={initialValues?.content} onChange={setContent} />
      </div>

      {/* 유튜브 URL */}
      <div className="flex items-center gap-2">
        <label className="text-sm font-medium text-slate-700 shrink-0 w-16">유튜브</label>
        <input
          name="youtube_url"
          type="url"
          defaultValue={initialValues?.youtube_url ?? ''}
          placeholder="https://youtube.com/watch?v=..."
          className="flex-1 min-w-0 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
        />
      </div>

      {/* 첨부파일 */}
      <AttachmentSection
        imageFiles={imageFiles}
        attachmentFiles={attachmentFiles}
        onImageChange={setImageFiles}
        onAttachmentChange={setAttachmentFiles}
        initialImages={initialImages}
        initialAttachments={initialAttachments}
      />

      {/* 에러 */}
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* 버튼 */}
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
