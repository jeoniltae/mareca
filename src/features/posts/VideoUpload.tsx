'use client'

import { useEffect, useRef, useState } from 'react'
import { createMuxUploadUrl, pollMuxVideoStatus, deleteMuxVideo } from './video-actions'
import { cn } from '@/lib/utils'
import { VideoIcon, Trash2, CheckCircle2, Loader2 } from 'lucide-react'
import type { PostVideo } from './video-actions'

type UploadState =
  | { kind: 'idle' }
  | { kind: 'uploading'; progress: number }
  | { kind: 'processing'; videoId: string }
  | { kind: 'ready'; videoId: string }
  | { kind: 'error'; message: string }

interface VideoUploadProps {
  onVideoReady: (videoId: string) => void
  onVideoRemove: () => void
  existingVideo?: Pick<PostVideo, 'id' | 'status'>
}

export function VideoUpload({ onVideoReady, onVideoRemove, existingVideo }: VideoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const xhrRef = useRef<XMLHttpRequest | null>(null)
  const pollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const getInitialState = (): UploadState => {
    if (!existingVideo) return { kind: 'idle' }
    if (existingVideo.status === 'ready') return { kind: 'ready', videoId: existingVideo.id }
    return { kind: 'processing', videoId: existingVideo.id }
  }

  const [state, setState] = useState<UploadState>(getInitialState)

  function stopPolling() {
    if (pollTimerRef.current) {
      clearTimeout(pollTimerRef.current)
      pollTimerRef.current = null
    }
  }

  function schedulePoll(videoId: string) {
    stopPolling()
    pollTimerRef.current = setTimeout(() => runPoll(videoId), 5000)
  }

  async function runPoll(videoId: string) {
    try {
      const status = await pollMuxVideoStatus(videoId)
      if (status === 'ready') {
        setState({ kind: 'ready', videoId })
        return
      }
      if (status === 'errored') {
        setState({ kind: 'error', message: '영상 처리 중 오류가 발생했습니다.' })
        return
      }
    } catch {
      // 네트워크 에러는 무시하고 재시도
    }
    schedulePoll(videoId)
  }

  // 기존 영상이 processing 상태면 마운트 시 폴링 시작
  useEffect(() => {
    if (state.kind === 'processing') {
      schedulePoll(state.videoId)
    }
    return () => stopPolling()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    try {
      setState({ kind: 'uploading', progress: 0 })

      const { videoId, uploadUrl } = await createMuxUploadUrl()

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhrRef.current = xhr

        xhr.upload.addEventListener('progress', (ev) => {
          if (ev.lengthComputable) {
            setState({ kind: 'uploading', progress: Math.round((ev.loaded / ev.total) * 100) })
          }
        })
        xhr.addEventListener('load', () =>
          xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`업로드 실패 (${xhr.status})`))
        )
        xhr.addEventListener('error', () => reject(new Error('네트워크 오류가 발생했습니다.')))
        xhr.addEventListener('abort', () => reject(new Error('업로드가 취소되었습니다.')))

        xhr.open('PUT', uploadUrl)
        xhr.send(file)
      })

      setState({ kind: 'processing', videoId })
      onVideoReady(videoId)
      schedulePoll(videoId)
    } catch (err) {
      setState({ kind: 'error', message: err instanceof Error ? err.message : '업로드 중 오류가 발생했습니다.' })
    }
  }

  async function handleRemove() {
    stopPolling()
    xhrRef.current?.abort()

    const videoId = (state.kind === 'processing' || state.kind === 'ready') ? state.videoId : null

    setState({ kind: 'idle' })
    onVideoRemove()

    if (videoId) {
      try { await deleteMuxVideo(videoId) } catch { /* silent */ }
    }
  }

  if (state.kind === 'idle') {
    return (
      <div>
        <input ref={inputRef} type="file" accept="video/*" className="hidden" onChange={handleFileChange} />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 py-6 text-sm text-slate-500 transition-colors hover:border-sky-400 hover:bg-sky-50 hover:text-sky-600"
        >
          <VideoIcon size={18} />
          동영상 파일 선택 (MP4, MOV, AVI 등)
        </button>
      </div>
    )
  }

  if (state.kind === 'uploading') {
    return (
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-slate-600">업로드 중...</span>
          <span className="font-medium text-sky-600">{state.progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-sky-500 transition-all duration-300"
            style={{ width: `${state.progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-400">업로드가 완료될 때까지 페이지를 닫지 마세요.</p>
      </div>
    )
  }

  if (state.kind === 'processing') {
    return (
      <div className="flex items-center justify-between rounded-xl border border-amber-100 bg-amber-50 p-4">
        <div className="flex items-center gap-2 text-sm text-amber-700">
          <Loader2 size={16} className="animate-spin" />
          <span>동영상 인코딩 중... (수 분 소요될 수 있습니다)</span>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="ml-4 shrink-0 text-slate-400 transition-colors hover:text-red-500"
          aria-label="영상 삭제"
        >
          <Trash2 size={16} />
        </button>
      </div>
    )
  }

  if (state.kind === 'error') {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 p-4">
        <p className="mb-2 text-sm text-red-600">{state.message}</p>
        <button type="button" onClick={() => setState({ kind: 'idle' })} className="text-sm text-sky-600 underline">
          다시 시도
        </button>
      </div>
    )
  }

  // ready
  return (
    <div className="flex items-center justify-between rounded-xl border border-green-100 bg-green-50 p-4">
      <div className="flex items-center gap-2 text-sm text-green-700">
        <CheckCircle2 size={16} />
        <span>동영상 준비 완료</span>
      </div>
      <button
        type="button"
        onClick={handleRemove}
        className={cn('ml-4 shrink-0 text-slate-400 transition-colors hover:text-red-500')}
        aria-label="영상 삭제"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
