'use client'
// 리폼드북스 책 등록/수정 폼 컴포넌트

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createBook, updateBook } from './actions'
import type { BookSections } from './actions'
import { cn } from '@/lib/utils'
import { ConfirmModal } from '@/components/shared/ConfirmModal'

type CoverInputMode = 'url' | 'file'

interface BookFormProps {
  mode: 'create' | 'edit'
  id?: string
  defaultValues?: {
    title: string
    thumbnail_url: string | null
    sections: BookSections | null
  }
  cancelHref: string
}

export function BookForm({ mode, id, defaultValues, cancelHref }: BookFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [coverMode, setCoverMode] = useState<CoverInputMode>('url')
  const [coverPreview, setCoverPreview] = useState<string | null>(
    defaultValues?.thumbnail_url ?? null
  )
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState(defaultValues?.thumbnail_url ?? '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const s = defaultValues?.sections

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB (Server Action bodySizeLimit과 동일)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      setError('파일 크기가 10MB를 초과합니다. 더 작은 이미지를 선택해 주세요.')
      e.target.value = ''
      setCoverPreview(null)
      return
    }

    setError(null)
    // blob URL — 일반 img 태그로 렌더링하므로 에러 없음
    const url = URL.createObjectURL(file)
    setCoverPreview(url)
  }

  function handleUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setThumbnailUrl(e.target.value)
    setCoverPreview(e.target.value || null)
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    setError(null)
    startTransition(async () => {
      try {
        if (mode === 'create') {
          const newId = await createBook(formData)
          router.replace(`/news/books/${newId}`)
        } else {
          await updateBook(id!, formData)
          router.replace(`/news/books/${id}`)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
      }
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 책 표지 */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-800 border-b border-slate-200 pb-2">책 표지</h2>
          <div className="flex gap-3 mb-3">
            <button
              type="button"
              onClick={() => setCoverMode('url')}
              className={cn(
                'px-4 py-1.5 text-sm rounded-lg border transition-colors',
                coverMode === 'url'
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              URL 입력
            </button>
            <button
              type="button"
              onClick={() => setCoverMode('file')}
              className={cn(
                'px-4 py-1.5 text-sm rounded-lg border transition-colors',
                coverMode === 'file'
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
              )}
            >
              파일 업로드
            </button>
          </div>

          <div className="flex gap-6 items-start">
            {coverMode === 'url' ? (
              <div className="flex-1">
                <input
                  type="url"
                  name="thumbnail_url"
                  value={thumbnailUrl}
                  onChange={handleUrlChange}
                  placeholder="https://example.com/cover.jpg"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            ) : (
              <div className="flex-1">
                <input type="hidden" name="thumbnail_url" value="" readOnly />
                <input
                  ref={fileInputRef}
                  type="file"
                  name="cover_file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100"
                />
                <p className="mt-1 text-xs text-slate-400">최대 10MB · JPG, PNG, WebP 등 이미지 파일</p>
              </div>
            )}

            {coverPreview && (
              // Next.js Image는 blob: URL을 지원하지 않으므로 일반 img 태그 사용
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverPreview}
                alt="책 표지 미리보기"
                className="shrink-0 w-24 h-32 object-cover rounded-lg border border-slate-200 shadow-sm"
              />
            )}
          </div>
        </section>

        {/* 책 기본 정보 */}
        <section className="space-y-4">
          <h2 className="text-base font-semibold text-slate-800 border-b border-slate-200 pb-2">책 정보</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                책 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                defaultValue={defaultValues?.title ?? ''}
                placeholder="책 제목을 입력하세요"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">부제</label>
              <input
                type="text"
                name="subtitle"
                defaultValue={s?.book_info?.subtitle ?? ''}
                placeholder="부제를 입력하세요 (선택)"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                저자 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="author"
                required
                defaultValue={s?.book_info?.author ?? ''}
                placeholder="저자명"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">출판사</label>
              <input
                type="text"
                name="publisher"
                defaultValue={s?.book_info?.publisher ?? ''}
                placeholder="출판사명"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">출판일</label>
              <input
                type="text"
                name="pub_date"
                defaultValue={s?.book_info?.pub_date ?? ''}
                placeholder="예: 2024-03"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">페이지 수</label>
              <input
                type="text"
                name="pages"
                defaultValue={s?.book_info?.pages ?? ''}
                placeholder="예: 320"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">ISBN</label>
              <input
                type="text"
                name="isbn"
                defaultValue={s?.book_info?.isbn ?? ''}
                placeholder="979-11-..."
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">가격</label>
              <input
                type="text"
                name="price"
                defaultValue={s?.book_info?.price ?? ''}
                placeholder="예: 18000"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </section>

        {/* 섹션 입력들 */}
        <section className="space-y-6">
          <h2 className="text-base font-semibold text-slate-800 border-b border-slate-200 pb-2">책 내용</h2>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              책 소개 <span className="text-red-500">*</span>
            </label>
            <textarea
              name="book_intro"
              required
              rows={8}
              defaultValue={s?.book_intro ?? ''}
              placeholder="책 소개 내용을 입력하세요"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">추천사</label>
            <textarea
              name="recommendation"
              rows={5}
              defaultValue={s?.recommendation ?? ''}
              placeholder="추천사를 입력하세요 (선택)"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">목차</label>
            <textarea
              name="table_of_contents"
              rows={5}
              defaultValue={s?.table_of_contents ?? ''}
              placeholder="목차를 입력하세요 (선택)"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">본문 미리보기</label>
            <textarea
              name="body_preview"
              rows={5}
              defaultValue={s?.body_preview ?? ''}
              placeholder="본문 발췌 내용을 입력하세요 (선택)"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">저자 소개</label>
            <textarea
              name="author_intro"
              rows={5}
              defaultValue={s?.author_intro ?? ''}
              placeholder="저자 소개를 입력하세요 (선택)"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">역자 소개</label>
            <textarea
              name="translator_intro"
              rows={5}
              defaultValue={s?.translator_intro ?? ''}
              placeholder="역자 소개를 입력하세요 (선택)"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y"
            />
          </div>
        </section>

        {/* 구매 링크 */}
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-slate-800 border-b border-slate-200 pb-2">구매 링크</h2>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">구매 링크 URL</label>
            <input
              type="url"
              name="purchase_url"
              defaultValue={s?.purchase_url ?? ''}
              placeholder="https://example.com/book (선택)"
              className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
            <p className="mt-1 text-xs text-slate-400">교보문고, 알라딘, Yes24 등 구매 가능한 링크를 입력하세요.</p>
          </div>
        </section>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</p>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              'px-6 py-2.5 text-sm font-semibold text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors',
              isPending && 'opacity-50 cursor-not-allowed'
            )}
          >
            {isPending ? '저장 중...' : mode === 'create' ? '도서 소개 등록' : '수정'}
          </button>
          <button
            type="button"
            onClick={() => setShowCancelConfirm(true)}
            className="px-6 py-2.5 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            취소
          </button>
        </div>
      </form>

      <ConfirmModal
        open={showCancelConfirm}
        title="작성을 취소하시겠습니까?"
        description="입력한 내용은 저장되지 않습니다."
        confirmLabel="취소하기"
        cancelLabel="계속 작성"
        confirmClassName="bg-slate-700 hover:bg-slate-800 text-white"
        onConfirm={() => router.push(cancelHref)}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </>
  )
}
