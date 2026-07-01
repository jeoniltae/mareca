'use client'

import dynamic from 'next/dynamic'
import { Loader2, VideoOff } from 'lucide-react'

const MuxPlayer = dynamic(() => import('@mux/mux-player-react'), { ssr: false })

interface VideoPlayerProps {
  playbackId: string | null
  status: string
}

export function VideoPlayer({ playbackId, status }: VideoPlayerProps) {
  if (status === 'errored') {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-10 text-sm text-red-500">
        <VideoOff size={24} />
        <span>동영상 처리 중 오류가 발생했습니다.</span>
      </div>
    )
  }

  if (status !== 'ready' || !playbackId) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 py-10 text-sm text-slate-500">
        <Loader2 size={24} className="animate-spin" />
        <span>동영상을 처리 중입니다. 잠시 후 새로고침하면 재생됩니다.</span>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl">
      <MuxPlayer
        playbackId={playbackId}
        streamType="on-demand"
        style={{ width: '100%', aspectRatio: '16/9' }}
      />
    </div>
  )
}
