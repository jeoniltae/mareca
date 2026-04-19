export function extractYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v')
    }
    if (parsed.hostname === 'youtu.be') {
      return parsed.pathname.slice(1).split('?')[0]
    }
  } catch {
    // invalid URL
  }
  return null
}

export function getYoutubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
}
