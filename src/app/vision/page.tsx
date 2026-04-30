import Image from 'next/image'
import { PageHeader } from '@/components/shared/PageHeader'

export const metadata = { title: '10 Missions' }

const MISSIONS = [
  {
    number: '01',
    title: '총회 사역',
    description: '한국을 비롯한 동남아시아 각국에 포진한 교회와 노회를 중심으로 국제적 총회를 구성하고 같은 믿음과 세례와 신학으로 일치를 구함',
    image: '/images/10missions/photo1.png',
  },
  {
    number: '02',
    title: '개혁교회 사역',
    description: '목사 회원들을 중심으로 개혁교회 홍보 활동 및 가입을 독려함',
    image: null,
  },
  {
    number: '03',
    title: '신학회 사역',
    description: '개혁신학포럼(4, 11월), 제주국제신학포럼(6월) 등',
    image: '/images/10missions/photo3.png',
  },
  {
    number: '04',
    title: '교육 사역',
    description: '마스터스 아카데미(학부과정), 마스터스세미너리(M, Div 이상) 등',
    image: '/images/10missions/photo2.png',
  },
  {
    number: '05',
    title: '선교 사역',
    description: '제주선교센터 및 선교대학',
    image: null,
  },
  {
    number: '06',
    title: '복지 사역',
    description: '(사) 두손클럽',
    image: null,
  },
  {
    number: '07',
    title: '사회참여 사역',
    description: '대변인제 운영 및 대사회 메시지 발표, 원탁회의 등',
    image: null,
  },
  {
    number: '08',
    title: '미디어 사역',
    description: '리폼드북스, MRA tv 등',
    image: null,
  },
  {
    number: '09',
    title: '정책연구 사역',
    description: '한국데이터연구소 등',
    image: null,
  },
  {
    number: '10',
    title: '재정 사역',
    description: '오아시스 영어학원, 기타',
    image: null,
  },
]

export default function TenMissionsPage() {
  return (
    <>
      <PageHeader
        title="10 Missions"
        breadcrumbs={[{ label: '비전과사명', href: '/vision' }, { label: '10 Missions' }]}
        backgroundImage="/images/breadcrumb/theodorus_beza.jpeg"
        bgColor="bg-slate-800"
        imagePosition="center 40%"
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.25em] text-sky-600 uppercase mb-3">
            Masters Reformed Assembly
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            10대 미션
          </h2>
          <p className="text-base text-slate-500 leading-relaxed sm:whitespace-nowrap mx-auto">
            마스터스개혁파총회는 한국교회의 갱신과 세계 보편 교회와의 일치를 위해 10가지 핵심 사역을 추진합니다.
          </p>
          <div className="mt-6 mx-auto w-10 h-0.5 bg-sky-600 rounded-full" />
        </div>

        {/* 타임라인 */}
        <div className="relative">
          {/* 세로 선 */}
          <div className="absolute left-6 sm:left-8 top-0 bottom-0 w-px bg-slate-200" />

          <div className="space-y-0">
            {MISSIONS.map((mission, idx) => {
              const isRight = idx % 2 === 0
              return (
                <div key={mission.number} className="relative pl-16 sm:pl-24 pb-10 last:pb-0">
                  {/* 번호 뱃지 */}
                  <div className="absolute left-0 sm:left-2 flex items-center justify-center w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-slate-800 text-white text-xs font-black shadow-md ring-4 ring-white">
                    {mission.number}
                  </div>

                  {/* 콘텐츠 */}
                  <div className={`flex flex-col ${mission.image ? 'sm:flex-row gap-6 items-start' : ''} ${mission.image && !isRight ? 'sm:flex-row-reverse' : ''}`}>
                    {/* 텍스트 */}
                    <div className={`${mission.image ? 'sm:flex-1' : 'w-full'} bg-white border border-slate-200 rounded-xl px-5 py-4 shadow-sm`}>
                      <h3 className="text-base font-bold text-slate-800 mb-1">{mission.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{mission.description}</p>
                    </div>

                    {/* 이미지 */}
                    {mission.image && (
                      <div className="relative w-full sm:w-56 aspect-4/3 rounded-xl overflow-hidden shadow-md shrink-0">
                        <Image src={mission.image} alt={mission.title} fill className="object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
