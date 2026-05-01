import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase-server'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mareca.org'

const BOARD_PATH_MAP: Record<string, string> = {
  'news': '/news/all',
  'notice': '/news/notice',
  'message': '/community/message',
  'voice': '/community/voice',
  'free': '/community/free',
  'album': '/community/album',
  'reformed-tv': '/community/reformed-tv',
  'sermon': '/resources/sermon',
  'education': '/resources/education',
  'pastoral': '/resources/pastoral',
  'worship': '/resources/worship',
  'minutes': '/report/minutes',
  'church-plan': '/online-admin/plan',
  'club-news': '/club-news/news',
}

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE_URL, changeFrequency: 'weekly', priority: 1.0 },
  { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE_URL}/about/confession`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE_URL}/about/chairman`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE_URL}/about/officers`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE_URL}/about/organization`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE_URL}/about/history`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE_URL}/about/reason`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE_URL}/about/logo`, changeFrequency: 'yearly', priority: 0.4 },
  { url: `${BASE_URL}/about/directions`, changeFrequency: 'yearly', priority: 0.5 },
  { url: `${BASE_URL}/vision`, changeFrequency: 'monthly', priority: 0.8 },
  { url: `${BASE_URL}/vision/identity`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE_URL}/vision/declaration`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE_URL}/constitution`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE_URL}/constitution/law`, changeFrequency: 'monthly', priority: 0.7 },
  { url: `${BASE_URL}/news`, changeFrequency: 'daily', priority: 0.8 },
  { url: `${BASE_URL}/news/all`, changeFrequency: 'daily', priority: 0.8 },
  { url: `${BASE_URL}/news/notice`, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/news/press`, changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE_URL}/community`, changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE_URL}/community/free`, changeFrequency: 'daily', priority: 0.7 },
  { url: `${BASE_URL}/community/message`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/community/voice`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/community/album`, changeFrequency: 'weekly', priority: 0.6 },
  { url: `${BASE_URL}/community/reformed-tv`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/resources`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/resources/sermon`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/resources/education`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/resources/pastoral`, changeFrequency: 'weekly', priority: 0.6 },
  { url: `${BASE_URL}/resources/worship`, changeFrequency: 'weekly', priority: 0.6 },
  { url: `${BASE_URL}/report`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE_URL}/report/minutes`, changeFrequency: 'monthly', priority: 0.6 },
  { url: `${BASE_URL}/club-news`, changeFrequency: 'weekly', priority: 0.6 },
  { url: `${BASE_URL}/club-news/news`, changeFrequency: 'weekly', priority: 0.6 },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const [{ data: posts }, { data: pressArticles }] = await Promise.all([
    supabase
      .from('posts')
      .select('id, board, updated_at')
      .order('updated_at', { ascending: false }),
    supabase
      .from('press_articles')
      .select('id, published_at')
      .order('published_at', { ascending: false }),
  ])

  const postUrls: MetadataRoute.Sitemap = (posts ?? []).flatMap((post) => {
    const boardPath = BOARD_PATH_MAP[post.board]
    if (!boardPath) return []
    return [{
      url: `${BASE_URL}${boardPath}/${post.id}`,
      lastModified: post.updated_at ? new Date(post.updated_at) : undefined,
      changeFrequency: 'monthly',
      priority: 0.6,
    }]
  })

  const pressUrls: MetadataRoute.Sitemap = (pressArticles ?? []).map((article) => ({
    url: `${BASE_URL}/news/press/${article.id}`,
    lastModified: article.published_at ? new Date(article.published_at) : undefined,
    changeFrequency: 'never',
    priority: 0.5,
  }))

  return [...STATIC_ROUTES, ...postUrls, ...pressUrls]
}
