'use client'
// 유튜브 영상을 지연 로드로 임베드하는 공용 플레이어 — ReformedTV·오픈강좌 등 영상 게시판이 함께 사용한다

import LiteYouTubeEmbed from 'react-lite-youtube-embed'
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

interface YoutubePlayerProps {
  videoId: string
  title: string
}

export function YoutubePlayer({ videoId, title }: YoutubePlayerProps) {
  return (
    <div className="rounded-xl overflow-hidden shadow-md">
      <LiteYouTubeEmbed id={videoId} title={title} />
    </div>
  )
}
