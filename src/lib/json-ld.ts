const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mareca.org'

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: '마스터스개혁파총회',
    alternateName: 'MRA',
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    description: '성경의 진리 위에 세워진 개혁파 신앙 공동체 — 마스터스개혁파총회(MRA)입니다.',
  }
}

export function articleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  imageUrl,
}: {
  title: string
  description: string
  url: string
  datePublished?: string
  dateModified?: string
  imageUrl?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    url,
    datePublished,
    dateModified: dateModified ?? datePublished,
    image: imageUrl ?? `${BASE_URL}/images/logo.png`,
    publisher: {
      '@type': 'Organization',
      name: '마스터스개혁파총회',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`,
      },
    },
  }
}
