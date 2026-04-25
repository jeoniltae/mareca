import { PageHeader } from '@/components/shared/PageHeader'
import { CheckCircle2, Users } from 'lucide-react'

export const metadata = { title: '총회조직 및 사역원칙' }

const AFFILIATED_CHURCHES = [
  { region: '서울', churches: '바로선개혁교회, 임마누엘교회, 청교도개혁교회' },
  { region: '경기', churches: '주기쁨교회, 더향기#교회, 나믄터기교회, 신성교회' },
  { region: '제주', churches: '하람교회, 서길교회' },
  { region: '해외', churches: '인도, 중국교회' },
]

const SUBSIDIARY = ['마스터스아카데미', '마스터스세미너리', '바이블시네마교육원', '리폼드북스', '리폼드TV']
const PARTNER = ['개혁신학포럼', '두손클럽', '오아시스영어학원']

const PRINCIPLES = [
  '모든 총회 사역은 헌법과 이사회의 결의에 따른다.',
  '팀 사역, 즉 팀장의 지도하에 책임 운영을 한다.',
  '모든 수익 및 비용은 본부기금(공식계좌)에서 관리하고 집행한다.',
  '사역의 재정을 충당하기 위해 후원금을 모금할 수 있고 별도의 수익사업에 참여할 수 있다.',
  '모든 사역은 별도의 보고서 제출과 사역평가를 받는다.',
]

const PRESBYTERY_TABLE = [
  { region: '한국', desc: '서울노회, 중부노회, 제주노회 등' },
  { region: '중국', desc: '북경노회, 지방노회' },
  { region: '몽고', desc: '울란파트라노회' },
  { region: '인도', desc: '뉴델리노회' },
  { region: '기타', desc: '해외노회' },
]

const REFORM_ITEMS = [
  '총회장 선출과 운용제도를 의장제도로 바꿉니다.',
  '총회의 의장은 2년 임기의 5인을 동시에 선출하여 추첨 혹은 호선에 의해 순차적으로 직을 맡아 봉사토록 합니다.',
  '모든 직분을 단순화하고, 계급적 운용을 철폐합니다.',
  '목사의 자격과 절차를 더욱 엄격하게 규정합니다.',
  '여성 사역자의 안수를 금하는 대신, 신학교육 이수자에게 사역을 확대 적용하고 그 대우를 남성 사역자와 동등하게 처리합니다. 호칭도 목사 대신 교육사로 통일합니다.',
  '선교사 훈련 및 파송 제도를 일원화합니다 (제주 국제선교훈련원).',
  '모든 신학교는 자의적이고 개별적으로 운영하는 것을 금하고 확정된 교과과정에 따라 교육함을 원칙으로 합니다. (마스터스 아카데미 / 세미너리 / 기타 지방신학교 운영)',
  '총회 소속 교회는 모두 ○○○ 개혁교회로 통일합니다.',
]

const TEN_MISSIONS = [
  { num: 1, field: '총회', system: '마스터스 개혁파 총회', desc: '6월 노회 · 12월 총회' },
  { num: 2, field: '신학', system: '개혁신학포럼', desc: '4월, 10월 정기세미나' },
  { num: 3, field: '목회', system: '마스터스 서울학당, 제주학당', desc: '목회자 스터디의 상설화' },
  { num: 4, field: '교육', system: '마스터스 아카데미 · 세미너리 · 바이블 시네마 교육원', desc: '신학교육 / 편입과정교육 / 평신도 및 사역자 성경교육' },
  { num: 5, field: '선교', system: '제주국제선교훈련원 · 아프리카 학교', desc: '선교사 양성 및 파송 후원 관리 / 아프리카선교' },
  { num: 6, field: '복지', system: '두손클럽', desc: '장애인 후원 봉사 / 기타봉사' },
  { num: 7, field: '사회', system: '원탁회의 · 교회 기초조사 연구소', desc: '사회적 제 문제에 대한 교회의 역할 및 메시지 / 기초 통계조사' },
  { num: 8, field: '미디어', system: '리폼드 TV · 마스터스 메타 처치', desc: '유튜브 채널 / 메타버스 내 복음센터' },
  { num: 9, field: '문서', system: '리폼드북스 · 저널《합》', desc: '도서출판 / 기관지' },
  { num: 10, field: '재정', system: '오아시스영어학원 · 기타', desc: '초·중·고생 대상 / 주부무료영어강좌 등' },
]

const HOW_ITEMS = [
  '국내·외 신학교 졸업 후 목사 안수자',
  '마스터스신학 졸업 후 강도사/목사고시 합격 및 안수자',
  '마스터스 세미너리를 통한 편목과정 수료자',
  '총회에서 인정한 신학 전문가 등',
  '기타(특별한 상황 등)',
]

const FUTURE_PLANS = [
  '개혁교회운동 — 100 교회, 300 사역자, 30,000 성도 목표',
  '해외 사역자 재교육 및 합법화',
  '마스터스 홀 및 각 지역 캠프 건립',
  '마스터스 아카데미 및 세미너리의 상설 운영',
  '한국교회의 문서 개혁 및 보급',
  '마스터스 스튜디오 운영 (마스터스 TV · 마스터스 신학자료실 등)',
  '선교사 교육 및 파송',
]

function SectionTitle({ en, ko }: { en: string; ko: string }) {
  return (
    <div className="mb-8">
      <p className="text-xs font-semibold tracking-[0.25em] text-sky-600 uppercase mb-2">{en}</p>
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">{ko}</h2>
      <div className="mt-3 w-10 h-0.5 bg-sky-600 rounded-full" />
    </div>
  )
}

export default function AboutOrganizationPage() {
  return (
    <>
      <PageHeader
        title="총회조직 및 사역원칙"
        breadcrumbs={[{ label: '총회소개', href: '/about' }, { label: '총회조직 및 사역원칙' }]}
        backgroundImage="/images/breadcrumb/john_calvin.jpg"
        bgColor="bg-[#3b2410]"
      />

      {/* ① 조직 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <SectionTitle en="Organization" ko="조직" />

        <div className="space-y-3 mb-10">
          {[
            { label: '총회', desc: '매년 10월 31일 본부(마스터스홀)에서 열립니다.' },
            { label: '노회', desc: '서울, 경기, 제주, 중국, 인도노회 (각 노회는 자체적으로 캠프를 설치 운영할 수 있다)' },
          ].map((item) => (
            <div key={item.label} className="flex items-start gap-3">
              <span className="shrink-0 px-3 py-1 bg-sky-600 text-white text-sm font-bold rounded-full">{item.label}</span>
              <p className="text-base text-slate-600 leading-relaxed pt-0.5">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* 소속교회 표 */}
        <h3 className="text-base font-bold text-slate-800 mb-3">소속교회</h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200 mb-10">
          <table className="w-full text-sm">
            <tbody>
              {AFFILIATED_CHURCHES.map((row, i) => (
                <tr key={row.region} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="w-20 text-center font-semibold text-slate-700 px-4 py-3 border-r border-slate-200">{row.region}</td>
                  <td className="px-4 py-3 text-slate-600">{row.churches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 부설기관 / 협력기관 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { title: '부설기관', items: SUBSIDIARY },
            { title: '협력기관', items: PARTNER },
          ].map(({ title, items }) => (
            <div key={title} className="rounded-xl border border-slate-200 overflow-hidden">
              <div className="bg-sky-600 px-5 py-3">
                <h3 className="text-sm font-bold text-white">{title}</h3>
              </div>
              <ul className="divide-y divide-slate-100">
                {items.map((item) => (
                  <li key={item} className="px-5 py-3 text-sm text-slate-600">{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ② 사역원칙 */}
      <section className="bg-[#1C2E50] py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold tracking-[0.25em] text-sky-400 uppercase mb-2">5 Principles</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">사역원칙</h2>
            <div className="mt-3 w-10 h-0.5 bg-sky-500 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRINCIPLES.map((text, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
                <span className="text-3xl font-extrabold text-white/10 leading-none block mb-3">0{i + 1}</span>
                <p className="text-sm text-slate-300 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ③ 무엇을 할 것인가? */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-14">
        <SectionTitle en="What" ko="무엇을 할 것인가?" />

        {/* 3-1 국외 무자격 목회자 합법화 */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">첫째, 국외의 무자격 목회자들을 합법화시킵니다.</h3>
          <div className="space-y-3 mb-6">
            {[
              '반세기에 걸쳐 한국교회는 정말로 선교에 열정적이었습니다. 어느새 세계 제2위의 선교사 파송 국가로 발돋움했습니다. 그러나 선교 명목으로 벌여놓은 일들에 대해 무한책임이 있음에도 사후관리(목사 안수, 교회/노회/총회 설립 등)에 부실하여 무자격, 무적 목회자들을 양산하는 나쁜 선례를 남겼습니다.',
              '마스터스 개혁파 총회는 국내 교회뿐 아니라 중국, 몽고, 인도 등 선교지의 목회자들과 함께 일구어내는 국내 최초의 국제적 총회입니다. 특히 신학교육 수료 후 안수 절차 없이 개인적인 사역을 하는 무적, 무자격 사역자들을 재교육 및 안수하여 그들에게 합법적인 사역을 제공하도록 힘쓸 것입니다.',
            ].map((p, i) => (
              <p key={i} className="text-base text-slate-600 leading-[1.9] pl-4 border-l-2 border-sky-200">{p}</p>
            ))}
          </div>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <tbody>
                <tr className="bg-sky-600">
                  <td className="text-white font-bold px-4 py-3 text-center" rowSpan={PRESBYTERY_TABLE.length + 1}>마스터스<br />개혁파 총회</td>
                </tr>
                {PRESBYTERY_TABLE.map((row, i) => (
                  <tr key={row.region} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="w-24 text-center font-semibold text-slate-700 px-4 py-3 border-x border-slate-200">{row.region}</td>
                    <td className="px-4 py-3 text-slate-600">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3-2 한국장로교회 개혁 */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">둘째, 한국장로교회를 개혁합니다.</h3>
          <div className="space-y-3 mb-6">
            {[
              '성경과 개혁파 전통에서 벗어난 한국장로교회 헌법을 개정합니다. 그리하여 명목상의 헌법이 아니라 실제 교회의 모든 행위가 헌법에 부합하도록 시정조치할 것입니다.',
            ].map((p, i) => (
              <p key={i} className="text-base text-slate-600 leading-[1.9] pl-4 border-l-2 border-sky-200">{p}</p>
            ))}
          </div>
          <p className="text-sm font-semibold text-slate-700 mb-3">주요 개정 내용</p>
          <ol className="space-y-2">
            {REFORM_ITEMS.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                <span className="shrink-0 w-6 h-6 rounded-full bg-slate-100 text-slate-500 text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>

        {/* 3-3 시스템 사역 10 미션 */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4">셋째, 시스템 사역을 정비합니다.</h3>
          <p className="text-base text-slate-600 leading-[1.9] pl-4 border-l-2 border-sky-200 mb-6">
            현재 개교회 중심의 교회 사역을 지양하고 원칙과 체계를 가진 시스템 사역으로 전환합니다. 한국교회를 위해 저희가 준비하는 10 미션(시스템)을 소개합니다.
          </p>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-100 text-slate-700">
                  <th className="px-3 py-3 text-center font-semibold w-10">#</th>
                  <th className="px-3 py-3 text-center font-semibold w-16">분야</th>
                  <th className="px-3 py-3 text-left font-semibold">시스템</th>
                  <th className="px-3 py-3 text-left font-semibold hidden sm:table-cell">내용</th>
                </tr>
              </thead>
              <tbody>
                {TEN_MISSIONS.map((row, i) => (
                  <tr key={row.num} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-3 py-3 text-center font-bold text-sky-600">{row.num}</td>
                    <td className="px-3 py-3 text-center font-medium text-slate-700">{row.field}</td>
                    <td className="px-3 py-3 text-slate-700">{row.system}</td>
                    <td className="px-3 py-3 text-slate-500 hidden sm:table-cell">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ④ 어떻게 참여하는가? */}
      <section className="bg-slate-50 py-16 sm:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.25em] text-sky-600 uppercase mb-2">How</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">어떻게 참여하는가?</h2>
            <div className="mt-3 w-10 h-0.5 bg-sky-600 rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HOW_ITEMS.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl border border-slate-100 shadow-sm px-5 py-4">
                <Users size={18} className="shrink-0 text-sky-500 mt-0.5" />
                <p className="text-sm text-slate-700 leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ⑤ 향후 계획 */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <SectionTitle en="Future Plans" ko="향후 계획은?" />
        <ul className="space-y-3">
          {FUTURE_PLANS.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckCircle2 size={18} className="shrink-0 text-sky-500 mt-0.5" />
              <p className="text-base text-slate-700 leading-relaxed">{item}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
