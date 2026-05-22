'use client'
// 마스터스 오픈강좌 게시글 작성/수정 폼 컴포넌트

import { useState, useTransition } from 'react'
import { Link2, Newspaper } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ConfirmModal } from '@/components/shared/ConfirmModal'
import { extractYoutubeId, getYoutubeThumbnail } from '@/features/youtube/youtube-utils'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { PostEditor } from '@/features/posts/PostEditor'
import { createOpenLecture, updateOpenLecture } from './actions'

interface OpenLectureFormProps {
  mode: 'create' | 'edit'
  postId?: string
  isAdmin: boolean
  initialValues?: {
    title: string
    category: string | null
    location: string | null
    event_date: string | null
    event_time: string | null
    content: string | null
    youtube_url: string | null
    article_url: string | null
  }
  cancelHref: string
}

export function OpenLectureForm({
  mode,
  postId,
  isAdmin,
  initialValues,
  cancelHref,
}: OpenLectureFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isCancelling, startCancelTransition] = useTransition()
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState(initialValues?.category ?? '일반')
  const [title, setTitle] = useState(initialValues?.title ?? '')
  const [location, setLocation] = useState(initialValues?.location ?? '')
  const [eventDate, setEventDate] = useState(initialValues?.event_date ?? '')
  const [eventTime, setEventTime] = useState(initialValues?.event_time ?? '')
  const [content, setContent] = useState(initialValues?.content ?? '')
  const [youtubeUrl, setYoutubeUrl] = useState(initialValues?.youtube_url ?? '')
  const [articleUrl, setArticleUrl] = useState(initialValues?.article_url ?? '')

  const videoId = extractYoutubeId(youtubeUrl)
  const thumbnailUrl = videoId ? getYoutubeThumbnail(videoId) : null

  async function handleSubmit(formData: FormData) {
    if (!title.trim()) {
      setError('제목을 입력해주세요.')
      return
    }
    if (category !== '공지') {
      if (!location.trim()) {
        setError('장소를 입력해주세요.')
        return
      }
      if (!eventDate) {
        setError('날짜를 입력해주세요.')
        return
      }
      if (!eventTime) {
        setError('시간을 입력해주세요.')
        return
      }
    }
    setError(null)

    formData.set('content', content)

    startTransition(async () => {
      try {
        if (mode === 'edit' && postId) {
          await updateOpenLecture(postId, formData)
        } else {
          await createOpenLecture(formData)
        }
      } catch (e) {
        if (isRedirectError(e)) throw e
        setError('저장 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      {/* 카테고리 */}
      <div>
        <label className="text-sm font-medium text-slate-700 block mb-2">
          카테고리 <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="category"
              value="일반"
              checked={category === '일반'}
              onChange={() => setCategory('일반')}
              className="sr-only"
            />
            <span
              className={cn(
                'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 select-none',
                category === '일반'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                  : 'bg-white text-slate-500 border-slate-200 hover:border-sky-400 hover:text-sky-600',
              )}
            >
              일반
            </span>
          </label>
          {isAdmin && (
            <label className="cursor-pointer">
              <input
                type="radio"
                name="category"
                value="공지"
                checked={category === '공지'}
                onChange={() => setCategory('공지')}
                className="sr-only"
              />
              <span
                className={cn(
                  'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150 select-none',
                  category === '공지'
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-amber-400 hover:text-amber-600',
                )}
              >
                공지
              </span>
            </label>
          )}
        </div>
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
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="강좌 제목을 입력하세요"
          className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
        />
      </div>

      {/* 장소 / 날짜 / 시간 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1.5">
            장소{' '}
            {category !== '공지'
              ? <span className="text-red-500">*</span>
              : <span className="text-slate-400 font-normal text-xs">(선택)</span>}
          </label>
          <input
            name="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="예: 서울 OO교회"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1.5">
            날짜{' '}
            {category !== '공지'
              ? <span className="text-red-500">*</span>
              : <span className="text-slate-400 font-normal text-xs">(선택)</span>}
          </label>
          <input
            name="event_date"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1.5">
            시간{' '}
            {category !== '공지'
              ? <span className="text-red-500">*</span>
              : <span className="text-slate-400 font-normal text-xs">(선택)</span>}
          </label>
          <input
            name="event_time"
            type="time"
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
      </div>

      {/* 본문 — 공지는 리치 텍스트 에디터, 일반은 textarea */}
      <div>
        <label className="text-sm font-medium text-slate-700 block mb-1.5">
          내용 <span className="text-slate-400 font-normal text-xs">(선택)</span>
        </label>
        {category === '공지' ? (
          <PostEditor
            initialContent={content}
            onChange={(html) => setContent(html)}
          />
        ) : (
          <textarea
            rows={6}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="강좌에 대한 설명을 입력하세요"
            className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300 resize-none"
          />
        )}
      </div>

      {/* 유튜브 URL */}
      <div>
        <label className="text-sm font-medium text-slate-700 block mb-1.5">
          유튜브 URL <span className="text-slate-400 font-normal text-xs">(선택)</span>
        </label>
        <div className="flex items-center gap-2">
          <Link2 size={18} className="text-red-500 shrink-0" />
          <input
            name="youtube_url"
            type="url"
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

      {/* 외부 기사 URL */}
      <div>
        <label className="text-sm font-medium text-slate-700 block mb-1.5">
          관련 기사 URL <span className="text-slate-400 font-normal text-xs">(선택 — 영상이 없을 경우 표시)</span>
        </label>
        <div className="flex items-center gap-2">
          <Newspaper size={18} className="text-slate-400 shrink-0" />
          <input
            name="article_url"
            type="url"
            value={articleUrl}
            onChange={(e) => setArticleUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300"
          />
        </div>
        {youtubeUrl && articleUrl && (
          <p className="text-xs text-amber-600 mt-1.5">
            유튜브 URL이 있으면 상세 화면에서 유튜브가 우선 표시됩니다.
          </p>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

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
        open={showCancelConfirm}
        title="작성 취소"
        description="작성 중인 내용이 저장되지 않습니다. 취소하시겠어요?"
        confirmLabel="취소하기"
        cancelLabel="계속 작성"
        confirmClassName="bg-red-500 hover:bg-red-600 text-white"
        onConfirm={() => {
          setShowCancelConfirm(false)
          startCancelTransition(() => {
            router.push(cancelHref)
          })
        }}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </form>
  )
}
