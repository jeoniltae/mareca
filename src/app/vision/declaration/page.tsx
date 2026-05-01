import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '선언문',
  description: '성경무오성, 개혁신학 등 마스터스개혁파총회의 5대 선언문입니다.',
  openGraph: { title: '선언문', description: '성경무오성, 개혁신학 등 마스터스개혁파총회의 5대 선언문입니다.', url: '/vision/declaration' },
}

const DECLARATIONS = [
  {
    num: '하나',
    title: '하나님의 법을 지킵니다',
    desc: '숙고에 숙고를 거듭한 끝에 개정한 마스터스총회 헌법 및 정치모범, 권징조례와 예배모범, 그리고 교육모범을 세웠습니다.',
  },
  {
    num: '둘',
    title: '성경무오성을 지키는 총회입니다',
    desc: '성경은 정확무오하고 영원불변의 하나님 말씀입니다. 우리는 성경이 우리 신앙과 삶의 절대기준으로서 성경이 가라면 가고 멈추라면 멈춥니다.',
  },
  {
    num: '셋',
    title: '개혁신학과 신앙을 이 땅에 널리 알릴 것입니다',
    desc: '선조들의 신조와 신앙고백들과 교회의 참된 표지를 수호하면서 개혁된 교회는 계속 개혁되어야 함을 믿습니다.',
  },
  {
    num: '넷',
    title: '마스터스 10미션의 소명을 수행합니다',
    desc: '제주도 마스터스홀을 중심으로 최선을 다할 것입니다.',
  },
  {
    num: '다섯',
    title: '해외사역자들의 보금자리가 될 것입니다',
    desc: '무소속, 무간수 해외 사역자들에게 합법적 자격을 부여합니다.',
  },
]

export default function AboutDeclarationPage() {
  return (
    <>
      {/* 헤더 섹션 */}
      <section className="bg-[#1C2E50] py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 브레드크럼 */}
          <nav className="flex items-center gap-1 text-lg text-white/60 mb-10">
            <Link href="/" className="hover:text-white transition-colors">홈</Link>
            <ChevronRight size={12} />
            <Link href="/vision/declaration" className="hover:text-white transition-colors">비전과사명</Link>
            <ChevronRight size={12} />
            <span className="text-[#C8A224] font-semibold">선언문</span>
          </nav>
        </div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img
              src="/images/logo.jpg"
              alt="마스터스개혁파총회 로고"
              width={72}
              height={72}
              className="rounded-full object-cover border-2 border-[#C8A224]"
            />
          </div>
          <p className="text-[#C8A224] text-xs font-semibold tracking-[0.3em] uppercase mb-3">
            Masters Reformed Assembly
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            마스터스 개혁파 총회 선언문
          </h2>
          <div className="mx-auto w-10 h-0.5 bg-[#C8A224] rounded-full" />
        </div>
      </section>

      {/* 선언 목록 */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="space-y-6">
          {DECLARATIONS.map((item, i) => (
            <div
              key={item.num}
              className="flex gap-5 sm:gap-7 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8"
            >
              {/* 번호 배지 */}
              <div className="shrink-0 flex flex-col items-center">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm"
                  style={{ backgroundColor: i % 2 === 0 ? '#1C2E50' : '#2A5728' }}
                >
                  {i + 1}
                </div>
                {i < DECLARATIONS.length - 1 && (
                  <div className="w-px flex-1 mt-3 bg-slate-100" />
                )}
              </div>

              {/* 내용 */}
              <div className="pt-1.5 pb-2">
                <p className="text-xs font-semibold text-[#C8A224] tracking-widest uppercase mb-1">
                  {item.num}
                </p>
                <h3 className="text-base sm:text-lg font-bold text-[#1C2E50] mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 하단 서명 */}
        <div className="mt-14 text-center">
          <div className="inline-block border-t-2 border-[#C8A224] pt-6 px-8">
            <p className="text-sm font-semibold text-[#1C2E50] tracking-wide">마스터스 개혁파 총회</p>
            <p className="text-xs text-slate-400 mt-1">Masters Reformed Assembly · MRA2023</p>
          </div>
        </div>
      </section>
    </>
  )
}
