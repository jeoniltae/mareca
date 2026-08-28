'use client'

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
