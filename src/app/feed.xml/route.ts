// 네이버 웹마스터 도구 RSS 피드 엔드포인트
import { createClient } from '@/lib/supabase-server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mareca.org'

const BOARD_PATH_MAP: Record<string, string> = {
  news: '/news/all',
  notice: '/news/notice',
  message: '/community/message',
  voice: '/community/voice',
  free: '/community/free',
  sermon: '/resources/sermon',
  education: '/resources/education',
  pastoral: '/resources/pastoral',
  worship: '/resources/worship',
  minutes: '/report/minutes',
  'church-plan': '/online-admin/plan',
  'club-news': '/club-news/news',
}

const BOARD_LABEL: Record<string, string> = {
  news: '총회소식',
  notice: '공지사항',
  message: '마스터스 메시지',
  voice: 'Plus Voice',
  free: '자유게시판',
  sermon: '설교자료실',
  education: '교육자료실',
  pastoral: '목회자료실',
  worship: '예배자료실',
  minutes: '총회의사록',
  'church-plan': '교회계획',
  'club-news': '클럽소식',
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export async function GET() {
  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select('id, board, title, content, created_at')
    .order('created_at', { ascending: false })
    .limit(50)

  const items = (posts ?? [])
    .filter((post) => BOARD_PATH_MAP[post.board])
    .map((post) => {
      const boardPath = BOARD_PATH_MAP[post.board]
      const url = `${BASE_URL}${boardPath}/${post.id}`
      const category = BOARD_LABEL[post.board] ?? post.board
      const plainText = (post.content ?? '')
        .replace(/<[^>]*>/g, '')
        .slice(0, 200)
      const pubDate = new Date(post.created_at ?? Date.now()).toUTCString()

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <description>${escapeXml(plainText)}</description>
      <category>${escapeXml(category)}</category>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${url}</guid>
    </item>`
    })
    .join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>마스터스개혁파총회</title>
    <link>${BASE_URL}</link>
    <description>마스터스개혁파총회(MRA)는 개혁주의 신앙과 성경의 진리 위에 세워진 한국 개혁파 교회 총회입니다. 총회 소식, 신앙 자료, 교회 공동체 정보를 제공합니다.</description>
    <language>ko</language>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
