import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '연혁 및 주요 행사' }

const HISTORY: { year: number; events: { date: string; title: string; desc?: string }[] }[] = [
  {
    year: 2023,
    events: [
      { date: '6. 25–29', title: '마스터스 3차 수련회', desc: '제주도' },
      { date: '5. 15', title: '마스터스세미너리 견학', desc: '강화도' },
      { date: '4. 28', title: '마스터스 4월 특별강좌', desc: '최더함 — 예수님의 7가지 스피치' },
      { date: '4. 9', title: '마스터스소속교회 부활절연합예배', desc: '신성교회' },
      { date: '3. 25', title: '법인공식계좌 공표', desc: '기업/마스터스개혁파총회 020-153222-04-015' },
      { date: '3. 24', title: '마스터스 3월 특별강좌', desc: '최더함 — 예수님이 전하신 하나님' },
      { date: '3. 23', title: '법인허가 및 세무신고' },
      { date: '3. 6', title: '마스터스세미너리 개강' },
      { date: '3. 3', title: '마스터스아카데미 개강' },
      { date: '2. 24', title: '마스터스 2월 특별강좌', desc: '최더함 — 유대교의 신앙과 삶' },
      { date: '2. 24', title: '마스터스 신년특별강좌', desc: '최더함(레위기), 서문강(개혁주의성령론) · 바로선개혁교회' },
      { date: '1. 8–10', title: '마스터스 사역자 수련회', desc: '설악대명콘도' },
    ],
  },
  {
    year: 2022,
    events: [
      { date: '10. 31', title: '창립예배 및 총회헌법 통과' },
      { date: '6. 21–29', title: '총회설립준비를 위한 1차 수련회', desc: '제주 하람교회, 서길교회' },
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
        bgColor="bg-[#3b2410]"
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
                        <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">{event.desc}</p>
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
