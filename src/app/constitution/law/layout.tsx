import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '헌법',
  description: '마스터스개혁파총회 헌법 및 정치모범, 권징조례, 예배모범 전문을 제공합니다.',
  openGraph: { title: '헌법', description: '마스터스개혁파총회 헌법 및 정치모범, 권징조례, 예배모범 전문을 제공합니다.', url: '/constitution/law' },
}

export default function ConstitutionLawLayout({ children }: { children: React.ReactNode }) {
  return children
}
