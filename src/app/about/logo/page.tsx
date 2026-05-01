import { LogoContent } from './LogoContent'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '총회로고',
  description: '마스터스개혁파총회 로고의 의미와 상징을 소개합니다.',
  openGraph: { title: '총회로고', description: '마스터스개혁파총회 로고의 의미와 상징을 소개합니다.', url: '/about/logo' },
}

export default function AboutLogoPage() {
  return <LogoContent />
}
