import { PageHeader } from '@/components/shared/PageHeader'
import { Crown, BookOpen, Building2 } from 'lucide-react'

export const metadata = { title: '신앙고백' }

const CONFESSIONS = [
  {
    num: '하나',
    en: 'Reformed Confessions of Faith',
    text: "우리는 '고대 신조'와 '유럽 3대 일치 신조'(하이델베르그, 벨직, 도르트신조)와 웨스트민스터 5대 표준문서(신앙고백서, 대·소요리문답, 정치 및 예배모범)를 믿고 따른다.",
  },
  {
    num: '둘',
    en: 'Bible',
    text: '우리는 성경만이 유일하고 무오한 하나님의 말씀이자 진리의 원천이며 하나님의 신실한 언약의 선언이라 믿는다.',
  },
  {
    num: '셋',
    en: 'Jesus Christ',
    text: '우리는 오직 하나님의 은혜의 믿음을 통해, 오직 예수 그리스도 안에서만 구속이 있고 예수 그리스도만이 구원의 길임을 믿는다.',
  },
  {
    num: '넷',
    en: 'Worship',
    text: '우리는 교회 안에서 설교와 성례를 통해서 하나님의 은혜 체험을 믿는다.',
  },
  {
    num: '다섯',
    en: 'Sanctification',
    text: '우리는 구원받은 주의 자녀로서 가장 기본적인 책무는 전도와 성화에 있다고 믿는다.',
  },
]

const SLOGANS = [
  { Icon: Crown, label: '하나님 중심', desc: 'God-Centered' },
  { Icon: BookOpen, label: '성경 중심', desc: 'Bible-Centered' },
  { Icon: Building2, label: '교회 중심', desc: 'Church-Centered' },
]

export default function AboutConfessionPage() {
  return (
    <>
      <PageHeader
        title="신앙고백"
        breadcrumbs={[{ label: '총회소개', href: '/about' }, { label: '신앙고백' }]}
        backgroundImage="/images/breadcrumb/john_calvin.jpg"
        bgColor="bg-[#3b2410]"
      />

      {/* 신앙고백 */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.25em] text-sky-600 uppercase mb-3">
            Confession of Faith
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">우리의 신앙고백</h2>
          <div className="mt-4 mx-auto w-10 h-0.5 bg-sky-600 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CONFESSIONS.map((item, i) => (
            <div
              key={item.num}
              className={`relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-7 flex flex-col${
                i === 4 ? ' sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              <span className="text-6xl font-extrabold text-slate-100 leading-none select-none mb-4">
                {item.num}
              </span>
              <h3 className="text-sm font-bold text-sky-700 uppercase tracking-wide mb-3">
                {item.en}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 슬로건 */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[0.25em] text-sky-600 uppercase mb-3">
              Our Slogan
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">우리의 슬로건</h2>
            <div className="mt-4 mx-auto w-10 h-0.5 bg-sky-600 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
            {SLOGANS.map(({ Icon, label, desc }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-4 bg-white rounded-2xl px-6 py-8 border border-slate-100 shadow-sm"
              >
                <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center">
                  <Icon size={26} className="text-sky-600" />
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-slate-900 mb-1">{label}</p>
                  <p className="text-xs text-slate-400 tracking-wide">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
