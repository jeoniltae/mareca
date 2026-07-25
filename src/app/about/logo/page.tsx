import { LogoContent } from './LogoContent'
import { breadcrumbJsonLd } from '@/lib/json-ld'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '총회로고',
  description: '마스터스개혁파총회 로고의 의미와 상징을 소개합니다.',
  openGraph: { title: '총회로고', description: '마스터스개혁파총회 로고의 의미와 상징을 소개합니다.', url: `${process.env.NEXT_PUBLIC_SITE_URL}/about/logo` },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/about/logo` },
}

const BREADCRUMBS = [{ label: '총회소개', href: '/about' }, { label: '총회로고' }]

export default function AboutLogoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(BREADCRUMBS)) }}
      />
      <LogoContent />
    </>
  )
}
