import { PageHeader } from '@/components/shared/PageHeader'
import Image from 'next/image'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이사장',
  description: '마스터스개혁파총회 이사장 최더함 목사의 인사말입니다.',
  openGraph: { title: '이사장', description: '마스터스개혁파총회 이사장 최더함 목사의 인사말입니다.', url: '/about/chairman' },
}

const PARAGRAPHS = [
  '이것이 마스터스 개혁파총회 설립에 대한 첫 반응이었습니다. 그런 분들에게 일일이 새로운 총회를 설립해야 하는 이유와 당위성을 설명하는 일이 쉽지 않았습니다.',
  '지난 10여 년 동안 하나님은 결코 이 일을 중단하거나 포기하시지 않으셨습니다. 그만큼 한국교회를 사랑하시고 한국교회를 통해 하실 일이 많으시기 때문입니다.',
  '동시에 하나님은 우리를 통해 사랑하는 우리 조국교회의 현실을 직시하고 문제점을 파악하도록 인도하시는 한편, 그 해결의 방책을 제안하시고 그 결과 마스터스개혁파총회라는 새로운 이름으로 다시 시작하도록 하셨습니다.',
  '물론 우리는 인간이 세운 제도나 시스템들이 완전한 것이 없고 언제든지 철폐될 수 있음을 잘 알고 있습니다. 그럼에도 우리는 오직 하나님을 바라보면서 이 일이 이 시대 우리에게 주어진 소명임을 확신하면서 온 세상 앞에 이 새로운 총회의 이름을 공표합니다.',
  '많은 기도와 적극적인 참여와 새로운 개혁을 위한 탐색과 해답이 찾아지길 소원합니다.',
]

export default function AboutChairmanPage() {
  return (
    <>
      <PageHeader
        title="이사장"
        breadcrumbs={[{ label: '총회소개', href: '/about' }, { label: '이사장' }]}
        backgroundImage="/images/breadcrumb/john_calvin.jpg"
        bgColor="bg-slate-800"
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* 프로필 카드 */}
          <div className="w-full lg:w-64 shrink-0 flex flex-col items-center lg:items-start">
            <div className="relative w-52 h-64 lg:w-full lg:h-72 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/choi_plus.png"
                alt="최더함 목사"
                fill
                className="object-cover object-top"
              />
            </div>
            <div className="mt-5 text-center lg:text-left">
              <p className="text-lg font-bold text-slate-900">최더함 목사</p>
              <p className="text-sm text-sky-600 font-medium mt-1">총회 이사장 및 임시의장</p>
              <p className="text-sm text-slate-400 mt-0.5">Masters Reformed Assembly</p>
            </div>
          </div>

          {/* 인사말 본문 */}
          <div className="flex-1 min-w-0">
            {/* 인용구 */}
            <blockquote className="relative mb-8">
              <span className="absolute -top-3 -left-2 text-6xl text-sky-200 font-serif leading-none select-none">"</span>
              <p className="text-2xl sm:text-3xl font-bold text-slate-900 leading-snug pl-6">
                또 하나 뭘 만든다고?
              </p>
              <span className="absolute -bottom-6 right-0 text-6xl text-sky-200 font-serif leading-none select-none rotate-180">"</span>
            </blockquote>

            <div className="w-10 h-0.5 bg-sky-600 rounded-full mb-8" />

            {/* 본문 단락 */}
            <div className="space-y-5">
              {PARAGRAPHS.map((para, i) => (
                <p key={i} className="text-base text-slate-600 leading-[1.9]">
                  {para}
                </p>
              ))}
            </div>

            {/* 서명 */}
            <div className="mt-10 pt-8 border-t border-slate-100 flex items-center justify-end gap-4">
              <div className="text-right">
                <p className="text-sm text-slate-500">총회 이사장 및 임시의장</p>
                <p className="text-lg font-bold text-slate-900 mt-0.5">최더함 목사</p>
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  )
}
