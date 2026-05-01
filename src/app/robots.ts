import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mareca.org'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/_next/',
        '/login/',
        '/*/new',
        '/*/edit',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
