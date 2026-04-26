import { PageHeader } from '@/components/shared/PageHeader'
import Image from 'next/image'

export const metadata = { title: '왜 마스터스개혁파총회를 시작하는가?' }

const REASONS = [
  {
    num: '첫째',
    title: '함께 길을 걷고자 합니다.',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    imageAlt: '함께 걷는 사람들',
    paragraphs: [
      '마스터스개혁파총회는 또 하나의 총회가 아니라 남들이 가지 않는 길을 걸으며 한국교회를 섬기고자 출발합니다. 무엇보다 이웃과 사회를 위한 구제와 봉사에도 열심을 다할 것입니다.',
      '나아가 명실공히 국제적인 총회로 발돋움하여 한국교회만이 아니라 전 세계의 보편 교회로서 신학적 일치와 사역의 일치, 그리고 예배의 일치를 이루는 그날까지 사력을 다할 것입니다.',
    ],
    reverse: false,
  },
  {
    num: '둘째',
    title: '책임을 지기 위해서입니다.',
    image: 'https://images.unsplash.com/photo-1493332724047-074a94db1c92?w=800&q=80',
    imageAlt: '교회 전경',
    paragraphs: [
      '미국, 캐나다 및 서구의 교회는 한국 땅에 복음을 전하기 위해 단지 씨앗만 뿌리고 방치한 것이 아니라 한국교회가 자립할 수 있는 제반 여건을 조성하기 위해 신학교 설립과 독노회 구성 등 끝까지 사후관리의 책임을 다했습니다. 그러나 한국교회는 그동안 선교라는 구호 아래 중국, 몽고, 인도를 비롯한 아시아권과 아프리카 등지에 선교사를 파송하는 등 외형적으로 혁혁한 성과를 올린 듯했지만 실상 신학교육과 개인적 사역에만 치중하고 사후관리에 무관심한 결과 현재 선교지에서 많은 무자격, 무소속 사역자들이 난립하고 있는 실정입니다.',
      '이에 마스터스개혁파총회는 제주도에 본부를 설립하고 국내 최초의 국제총회를 구성하여 안수없이, 혹은 소속도 없이 제 홀로 교회를 세우고 목회를 하는 사역자들에게 합법적인 안수와 소속 노회 및 총회를 제공하고, 국내외 사역자들에게 개혁파 신학에 의한 신학과 신앙의 일치를 꾀하려 합니다.',
    ],
    reverse: true,
  },
  {
    num: '셋째',
    title: '부실공사를 재정비하려고 합니다.',
    image: 'https://images.unsplash.com/photo-1759127481171-30a27de310ad?w=800&q=80',
    imageAlt: '교회 예배 모습',
    paragraphs: [
      '전세계적으로 한국교회는 덩치만 큰 아이로 평가받습니다. 그만큼 기초공사가 부실하다는 것을 반증합니다. 이제 형식보다 내실을 기해야 합니다. 실제로 한국교회에 필요하고 유용한 제도나 각종 시스템의 신설 혹은 재정비가 시급합니다.',
      '무엇보다 한국교회의 현실을 파악할 수 있는 장치가 필요합니다. 이를 위해 저희는 가칭 리폼드센터를 건립하고 이곳에서 10대 미션의 시스템을 완비하여 체계적이고 지속적인 교회사역을 지원하거나 협력할 계획입니다. 특히 한국교회의 기초조사연구소의 설립을 신속하게 실행하여 각종 통계 자료를 수집 분석하여 한국교회의 정책 수립과 선교 방향을 결정하는 일에 기여할 것입니다.',
      '이외 시대에 걸맞지 않은 각종 문서를 개정 혹은 교정할 것입니다. 현재 저희는 한국장로교헌법의 개정 작업을 하고 있는 중입니다. 이 새로운 헌법은 성경적 근거가 없는 모든 조항을 정비하는 것을 목표로 합니다. 가령, 총회장 제도를 폐지하고 임기 2년의 의장직을 신설하는 한편, 5명의 후보군을 동시에 선발하여 순번에 따라 의장직을 수행하도록 하는 새로운 대표제와 총회의 모든 메시지를 관리하고 공표하는 대변인 제도를 신설하는 일, 집사 및 장로 직분의 계급제를 타파하는 일, 여성 사역자에 대한 뚜렷한 사역 근거를 제공하는 일, 목사의 교육과 엄격한 자질 검사, 비성경적인 교회정치제도 등을 정비합니다. 아울러 교회의 각종 문서들에서 국어문법을 벗어난 문장의 교열·교정 작업도 병행합니다.',
    ],
    reverse: false,
  },
]

export default function AboutReasonPage() {
  return (
    <>
      <PageHeader
        title="왜 마스터스개혁파총회를 시작하는가?"
        breadcrumbs={[{ label: '총회소개', href: '/about' }, { label: '왜 마스터스개혁파총회를 시작하는가?' }]}
        backgroundImage="/images/breadcrumb/john_calvin.jpg"
        bgColor="bg-slate-800"
      />

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* 섹션 헤더 */}
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.25em] text-sky-600 uppercase mb-3">
            Masters Reformed Assembly
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            왜 마스터스개혁파총회를 시작하는가?
          </h2>
          <div className="mt-4 mx-auto w-10 h-0.5 bg-sky-600 rounded-full" />
        </div>

        {/* 이유 목록 */}
        <div className="space-y-20 sm:space-y-28">
          {REASONS.map((item) => (
            <div
              key={item.num}
              className={`flex flex-col gap-10 md:grid md:grid-cols-2 md:gap-14 md:items-center${item.reverse ? ' md:[&>*:first-child]:order-2' : ''}`}
            >
              {/* 이미지 */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src={item.image}
                  alt={item.imageAlt}
                  fill
                  className="object-cover"
                />
              </div>

              {/* 텍스트 */}
              <div>
                <span className="inline-block text-xs font-bold tracking-[0.2em] text-sky-600 uppercase bg-sky-50 px-3 py-1 rounded-full mb-4">
                  {item.num}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6 leading-snug">
                  {item.title}
                </h3>
                <div className="space-y-4">
                  {item.paragraphs.map((para, i) => (
                    <p key={i} className="text-base text-slate-600 leading-[1.9]">
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
