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
  insertPostAttachments,
  deleteEditorImages,
} from './actions'
import { createClient } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { ConfirmModal } from '@/components/shared/ConfirmModal'

const DEFAULT_CATEGORIES = ['일반', '질문', '나눔'] as const

async function uploadAttachmentClient(file: File): Promise<{
  file_name: string
  file_url: string
  file_size: number
  mime_type: string
}> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('로그인이 필요합니다')

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const baseName = safeName.replace(/\.[^.]+$/, '')
  const ext = safeName.split('.').pop() ?? ''
  const contentType = file.type || 'application/octet-stream'
  const path = `${user.id}/${Date.now()}_${baseName}.${ext}`

  const { error } = await supabase.storage
    .from('post-attachments')
    .upload(path, file, { contentType })

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = supabase.storage
    .from('post-attachments')
    .getPublicUrl(path)

  return { file_name: file.name, file_url: publicUrl, file_size: file.size, mime_type: contentType }
}

function extractEditorImageUrls(html: string): string[] {
  return [...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map((m) => m[1])
}

interface PostFormProps {
  mode: 'create' | 'edit'
  postId?: string
  board?: string
  boardPath?: string
  categories?: readonly string[]
  pinOnly?: boolean
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

export function PostForm({ mode, postId, board = 'free', boardPath = '/community/free', categories = DEFAULT_CATEGORIES, pinOnly = false, initialValues, initialImages, initialAttachments, cancelHref }: PostFormProps) {
  const router = useRouter()
  const [content, setContent] = useState(initialValues?.content ?? '')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([])
  const [isPending, startTransition] = useTransition()
  const [isCancelling, startCancelTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [editorImageUrls, setEditorImageUrls] = useState<string[]>([])
  const [isPin, setIsPin] = useState(initialValues?.category === '공지')

  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    if (!pinOnly && !formData.get('category')) {
      setError('분류를 선택해주세요.')
      return
    }
    if (!content.trim() || content === '<p></p>') {
      setError('내용을 입력해주세요.')
      return
    }
    setError(null)
    formData.set('content', content)
    setPendingFormData(formData)
    setShowSubmitConfirm(true)
  }

  async function handleSubmit(formData: FormData) {

    startTransition(async () => {
      try {
        const targetId = mode === 'edit' && postId
          ? (await updatePost(postId, formData, boardPath), postId)
          : await createPost(formData)

        // 에디터에서 제거된 이미지 스토리지 정리
        const finalImageUrls = new Set(extractEditorImageUrls(content))
        const urlsToDelete = [...new Set([
          ...editorImageUrls.filter((url) => !finalImageUrls.has(url)),
          ...extractEditorImageUrls(initialValues?.content ?? '').filter((url) => !finalImageUrls.has(url)),
        ])]
        if (urlsToDelete.length > 0) await deleteEditorImages(urlsToDelete)

        // 이미지 업로드 (파일별 FormData)
        const imageUrls = await Promise.all(
          imageFiles.map((file, i) => {
            const fd = new FormData()
            fd.append('file', file)
            fd.append('order', String(i))
            return uploadPostImage(fd)
          })
        )
        // 파일 업로드 (클라이언트에서 Supabase Storage 직접 업로드)
        const attachmentMetas = await Promise.all(
          attachmentFiles.map((file) => uploadAttachmentClient(file))
        )

        await Promise.all([
          insertPostImages(targetId, imageUrls),
          insertPostAttachments(targetId, attachmentMetas),
        ])

        router.push(`${boardPath}/${targetId}`)
      } catch (error) {
        if ((error as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')) throw error
        setError('저장 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    })
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5">
      <input type="hidden" name="board" value={board} />
      {/* 카테고리 */}
      {pinOnly ? (
        <div className="flex items-center gap-2">
          <input type="hidden" name="category" value={isPin ? '공지' : '일반'} />
          <label className="text-sm font-medium text-slate-700 shrink-0 w-16">공지</label>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPin}
              onChange={(e) => setIsPin(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 accent-sky-600"
            />
            <span className="text-sm text-slate-600">공지글로 등록</span>
          </label>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700 shrink-0 w-16">분류</label>
          <select
            name="category"
            defaultValue={initialValues?.category ?? ''}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
          >
            <option value="" disabled>선택하세요</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      )}

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
        <PostEditor
          initialContent={initialValues?.content}
          onChange={setContent}
          onImageUploaded={(url) => setEditorImageUrls((prev) => [...prev, url])}
        />
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
        <button
          type="button"
          onClick={() => setShowCancelConfirm(true)}
          disabled={isCancelling}
          className={cn(
            'px-5 py-2.5 text-sm text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors',
            isCancelling && 'opacity-60 cursor-not-allowed',
          )}
        >
          {isCancelling ? '취소 중...' : '취소'}
        </button>
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

      <ConfirmModal
        open={showSubmitConfirm}
        title={mode === 'edit' ? '수정 완료' : '등록'}
        description={mode === 'edit' ? '게시글을 수정하시겠어요?' : '게시글을 등록하시겠어요?'}
        confirmLabel={mode === 'edit' ? '수정 완료' : '등록'}
        cancelLabel="다시 확인"
        onConfirm={() => {
          setShowSubmitConfirm(false)
          if (pendingFormData) handleSubmit(pendingFormData)
        }}
        onCancel={() => setShowSubmitConfirm(false)}
      />

      <ConfirmModal
        open={showCancelConfirm}
        title="작성 취소"
        description="작성 중인 내용이 저장되지 않습니다. 취소하시겠어요?"
        confirmLabel="취소하기"
        cancelLabel="계속 작성"
        confirmClassName="bg-red-500 hover:bg-red-600 text-white"
        onConfirm={() => {
          setShowCancelConfirm(false)
          startCancelTransition(async () => {
            await deleteEditorImages(editorImageUrls)
            router.push(cancelHref)
          })
        }}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </form>
  )
}
