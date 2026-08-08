import type { Metadata } from 'next'
import { OG_IMAGE } from '@/lib/constants'

const TITLE = '총회헌법 — 정치·권징조례·예배모범 전문'
const DESCRIPTION =
  '마스터스개혁파총회 헌법 전문. 장로교 정치 원리와 치리 구조를 다룬 정치, 교회 권징 절차를 규정한 권징조례, 공예배 원칙을 담은 예배모범을 조문별로 읽을 수 있습니다.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${process.env.NEXT_PUBLIC_SITE_URL}/constitution/law`, images: [OG_IMAGE] },
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/constitution/law` },
}

export default function ConstitutionLawLayout({ children }: { children: React.ReactNode }) {
  return children
}
