import { PageHeader } from '@/components/shared/PageHeader'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '연혁 및 주요 행사',
  description: '2023년 창립부터 현재까지 마스터스개혁파총회의 주요 연혁과 행사를 소개합니다.',
  openGraph: { title: '연혁 및 주요 행사', description: '2023년 창립부터 현재까지 마스터스개혁파총회의 주요 연혁과 행사를 소개합니다.', url: '/about/history' },
}

const HISTORY: { year: number; events: { date: string; title: string; desc?: string }[] }[] = [
  {
    year: 2026,
    events: [
      { date: '4. 5', title: '마스터스 총회 부활절 감사 연합예배', desc: '바로선개혁교회' },
      { date: '2. 2–3', title: '마스터스 클럽 10차 수련회', desc: '청풍 유스호스텔' },
      { date: '1. 3', title: '신년하례회', desc: '서울본부' },
    ],
  },
  {
    year: 2025,
    events: [
      { date: '11. 16', title: '마스터스 총회 추수감사 및 주기쁨교회 이전 연합예배', desc: '주기쁨교회' },
      { date: '10. 30–11. 2', title: '마스터스개혁파 임시 총회 및 마스터스개혁파총회 공식 출범 축하 행사', desc: '제주 헤리티지 훈련원' },
      { date: '9. 6', title: '아카데미 개강예배 및 입학식' },
      { date: '7. 19', title: '졸업예배 및 졸업식' },
      { date: '6. 22–26', title: '마스터스 클럽 9차 수련회 및 MRA 졸업여행', desc: '제주 하람교회' },
      { date: '5. 1', title: '서울본부 이전(구파발)' },
      { date: '1. 12–14', title: '마스터스 목회자 8차 수련회', desc: '청풍 유스호스텔' },
    ],
  },
  {
    year: 2024,
    events: [
      { date: '10. 31', title: '마스터스 목회자 3차 임시총회', desc: '제주하람교회 / 최상권목사 시무' },
      { date: '9. 23–26', title: '본부 주소지 관련 송기수 장로 방문' },
      { date: '8. 14–16', title: '마스터스 목회자 7차 수련회', desc: '청풍 유스호스텔' },
      { date: '4. 19', title: '본부건립 및 그 외 안건으로 회의소집', desc: '임마누엘교회 김중득 목사, 서길교회 변성휘 목사가 헌법 의견에 동의하지 않아 자진 탈퇴함\n본부 관련 사역들 전면 보류 및 수정 요함' },
      { date: '2. 16', title: '서길교회 뒤 1260평에 본부 건립을 위한 건축위원장 및 건축위원들 선임', desc: '서길교회 / 변성휘목사 시무' },
      { date: '2. 13–15', title: '사경회', desc: '제주하람교회 / 최상권목사 시무' },
      { date: '1. 21–23', title: '마스터스 목회자 6차 수련회', desc: '바로선개혁교회' },
    ],
  },
  {
    year: 2023,
    events: [
      { date: '10. 31', title: '제2차 임시총회', desc: '제주하람교회 / 최상권목사 시무' },
      { date: '6. 25–29', title: '마스터스 목회자 4차 수련회', desc: '제주 오랑주리' },
      { date: '6. 25–29', title: '마스터스세미너리 견학', desc: '강화도' },
      { date: '4. 28', title: '마스터스 4월 특별강좌', desc: '최더함 — 예수님의 7가지 스피치' },
      { date: '4. 9', title: '마스터스총회 부활절 연합 예배', desc: '신성교회 / 임현상목사 시무' },
      { date: '3. 25', title: '법인공식계좌 공표', desc: '기업/마스터스개혁파총회 020-153222-04-015' },
      { date: '3. 24', title: '마스터스 3월 특별강좌', desc: '최더함 — 예수님이 전하신 하나님' },
      { date: '3. 23', title: '고유번호증 발급 (제주 세무서장)', desc: '고유번호 742-82-00681' },
      { date: '3. 9', title: '등기사항전부증명서 발급' },
      { date: '3. 3', title: '마스터스아카데미 개강' },
      { date: '2. 24', title: '마스터스 신년특별강좌', desc: '최더함(레위기), 서문강(개혁주의성령론) · 바로선개혁교회' },
      { date: '2. 22', title: '비영리법인 설립허가증 발급' },
      { date: '1. 8–10', title: '마스터스 목회자 3차 수련회', desc: '오색그린야드호텔' },
    ],
  },
  {
    year: 2022,
    events: [
      { date: '10. 31', title: '마스터스개혁파총회 창립예배', desc: '서길교회 / 변성휘목사 (제1차 임시총회)\n총회원 56명 중 43명이 출석하여 의장선출외 8개의 안건을 통과시킴' },
      { date: '10. 23', title: '창립예배를 위한 사모기도회 및 마스터스설명회', desc: '바로선개혁교회 / 최더함목사 시무' },
      { date: '10. 8', title: '마스터스아카데미(MRT-A) 첫 개강', desc: '바로선개혁교회 / 최더함목사 시무' },
      { date: '9. 15–16', title: '마스터스 아카데미 교수 수련회 및 2차 수련회', desc: '오색그린야드호텔' },
      { date: '6. 26-29', title: '총회설립준비를 위한 1차 수련회', desc: '제주 하람교회, 서길교회' },
    ],
  },
  {
    year: 2021,
    events: [
      { date: '11. 15', title: '마스터스개혁파총회 설립 선포식', desc: '하람교회 / 최상권목사 시무' },
    ],
  },
]

export default function AboutHistoryPage() {
  return (
    <>
      <PageHeader
        title="연혁 및 주요 행사"
        breadcrumbs={[{ label: '총회소개', href: '/about' }, { label: '연혁 및 주요 행사' }]}
        backgroundImage="/images/breadcrumb/john_calvin.jpg"
        bgColor="bg-slate-800"
      />

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.25em] text-sky-600 uppercase mb-3">
            Masters Reformed Assembly
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">연혁 및 주요 행사</h2>
          <div className="mt-4 mx-auto w-10 h-0.5 bg-sky-600 rounded-full" />
        </div>

        <div className="space-y-12">
          {HISTORY.map(({ year, events }) => (
            <div key={year}>
              {/* 연도 헤더 */}
              <div className="flex items-center gap-4 mb-6">
                <div className="shrink-0 px-5 py-2 bg-sky-600 text-white text-lg font-bold rounded-full shadow-sm">
                  {year}
                </div>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* 이벤트 목록 */}
              <div className="relative ml-3 pl-8 border-l-2 border-slate-200 space-y-0">
                {events.map((event, i) => (
                  <div key={i} className="relative pb-7 last:pb-0">
                    {/* 타임라인 점 */}
                    <span className="absolute -left-[calc(2rem+1px)] top-1.5 w-3 h-3 rounded-full bg-white border-2 border-sky-500 shadow-sm" />

                    {/* 카드 */}
                    <div className="bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <h3 className="text-base font-semibold text-slate-900 leading-snug">
                          {event.title}
                        </h3>
                        <span className="shrink-0 text-xs font-medium text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full whitespace-nowrap">
                          {year}. {event.date}
                        </span>
                      </div>
                      {event.desc && (
                        <p className="mt-1.5 text-sm text-slate-500 leading-relaxed whitespace-pre-line">{event.desc}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
