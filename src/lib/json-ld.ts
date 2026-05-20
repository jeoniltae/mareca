const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.mareca.org'

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

export function confessionPageJsonLd() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '홈', item: BASE_URL },
        { '@type': 'ListItem', position: 2, name: '총회소개', item: `${BASE_URL}/about` },
        { '@type': 'ListItem', position: 3, name: '신앙고백', item: `${BASE_URL}/about/confession` },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: '마스터스개혁파총회는 어떤 신앙고백을 따르나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: "고대 신조와 유럽 3대 일치 신조(하이델베르그, 벨직, 도르트신조)와 웨스트민스터 5대 표준문서(신앙고백서, 대·소요리문답, 정치 및 예배모범)를 믿고 따릅니다.",
          },
        },
        {
          '@type': 'Question',
          name: '성경에 대해 어떻게 고백하나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '성경만이 유일하고 무오한 하나님의 말씀이자 진리의 원천이며 하나님의 신실한 언약의 선언이라 믿습니다.',
          },
        },
        {
          '@type': 'Question',
          name: '구원에 대해 어떻게 고백하나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '오직 하나님의 은혜의 믿음을 통해, 오직 예수 그리스도 안에서만 구속이 있고 예수 그리스도만이 구원의 길임을 믿습니다.',
          },
        },
        {
          '@type': 'Question',
          name: '예배에 대해 어떻게 고백하나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '교회 안에서 설교와 성례를 통해서 하나님의 은혜 체험을 믿습니다.',
          },
        },
        {
          '@type': 'Question',
          name: '그리스도인의 삶에 대해 어떻게 고백하나요?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: '구원받은 주의 자녀로서 가장 기본적인 책무는 전도와 성화에 있다고 믿습니다.',
          },
        },
      ],
    },
  ]
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
