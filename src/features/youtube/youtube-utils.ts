export function extractYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtube.com')) {
      // Shorts: youtube.com/shorts/VIDEO_ID
      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/shorts/')[1].split(/[?&]/)[0] || null
      }
      // Live: youtube.com/live/VIDEO_ID
      if (parsed.pathname.startsWith('/live/')) {
        return parsed.pathname.split('/live/')[1].split(/[?&]/)[0] || null
      }
      // 일반: youtube.com/watch?v=VIDEO_ID
      return parsed.searchParams.get('v')
    }
    // 단축 · 공유: youtu.be/VIDEO_ID?si=...
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1).split(/[?&]/)[0] || null
    }
  } catch {
    // invalid URL
  }
  return null
}

export function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
}
