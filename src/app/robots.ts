import type { MetadataRoute } from 'next'

const DISALLOW_PATHS = ['/api/', '/_next/', '/login/', '/*/new$', '/*/edit$']

// AI 검색·답변 엔진 크롤러 — 전부 허용(학습용/검색용 구분 없이 최대 노출)
const AI_CRAWLER_USER_AGENTS = [
  'GPTBot',
  'ChatGPT-User',
  'OAI-SearchBot',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Bytespider',
  'CCBot',
  'Meta-ExternalAgent',
  'Amazonbot',
]

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mareca.org'
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW_PATHS,
      },
      {
        userAgent: AI_CRAWLER_USER_AGENTS,
        allow: '/',
        disallow: DISALLOW_PATHS,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
