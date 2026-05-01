import { PageHeader } from '@/components/shared/PageHeader'
import Image from 'next/image'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '우리는 누구인가?',
  description: '마스터스개혁파총회의 정체성과 신학적 입장을 소개합니다.',
  openGraph: { title: '우리는 누구인가?', description: '마스터스개혁파총회의 정체성과 신학적 입장을 소개합니다.', url: '/vision/identity' },
}

const IDENTITY_ITEMS = [
  '우리는 영원 전에 택함을 받은 하나님의 자녀들입니다.',
  '우리는 예수 그리스도의 피로 구속을 받은 그리스도인입니다.',
  '우리는 종교개혁의 후손이자 개혁파 성도입니다.',
  '우리는 칼빈주의(개혁주의) 신학과 신앙 위에 세운 장로교회 신자입니다.',
  '우리는 하나님의 언약 백성입니다.',
]

const THEOLOGY_ITEMS = [
  '초대교회와 종교개혁의 정신을 고수합니다.',
  '개혁주의(칼빈주의) 신학의 노선과 장로교회 정치제를 추구합니다.',
  '국내 최초로 제주도에 설립된 국제총회입니다.',
  '조국교회의 위상과 발전에 이바지하고 개혁을 통해 헌신합니다.',
  '시대에 발맞추고 시대변화를 알리는 나팔수로서 사명을 다합니다.',
]

export default function AboutIdentityPage() {
  return (
    <>
      <PageHeader
        title="우리는 누구인가?"
        breadcrumbs={[{ label: '비전과사명', href: '/vision' }, { label: '우리는 누구인가?' }]}
        backgroundImage="/images/breadcrumb/theodorus_beza.jpeg"
        bgColor="bg-slate-800"
        imagePosition="center 40%"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">

        {/* Section 1 — 우리는 누구인가? */}
        <div className="rounded-2xl overflow-hidden shadow-md border border-slate-100">
          {/* 배너 이미지 */}
          <div className="relative h-56 sm:h-72">
            <Image
              src="https://images.unsplash.com/photo-1476490358217-f4f7e59d4081?w=1200&q=80"
              alt="펼쳐진 성경"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.25em] text-sky-300 uppercase mb-1">
                Who are we?
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">우리는 누구인가?</h2>
            </div>
          </div>

          {/* 카드 목록 */}
          <div className="bg-white p-6 sm:p-8">
            <ol className="space-y-3">
              {IDENTITY_ITEMS.map((item, i) => (
                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-sky-50 transition-colors">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-base text-slate-700 leading-relaxed">{item}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Section 2 — 우리의 신학 및 신앙노선 */}
        <div className="rounded-2xl overflow-hidden shadow-md border border-slate-100">
          {/* 배너 이미지 */}
          <div className="relative h-56 sm:h-72">
            <Image
              src="https://images.unsplash.com/photo-1437603568260-1950d3ca6eab?w=1200&q=80"
              alt="성경을 펼치고 기도하는 모습"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.25em] text-sky-300 uppercase mb-1">
                Theology
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">우리의 신학 및 신앙노선</h2>
            </div>
          </div>

          {/* 카드 목록 */}
          <div className="bg-white p-6 sm:p-8">
            <ol className="space-y-3">
              {THEOLOGY_ITEMS.map((item, i) => (
                <li key={i} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 hover:bg-sky-50 transition-colors">
                  <span className="shrink-0 w-7 h-7 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <p className="text-base text-slate-700 leading-relaxed">{item}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>

      </div>
    </>
  )
}
