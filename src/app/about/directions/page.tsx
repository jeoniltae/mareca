import { MapPin, Phone, Mail } from 'lucide-react'
import { PageHeader } from '@/components/shared/PageHeader'
import { KakaoMap } from '@/components/shared/KakaoMap'

export const metadata = { title: '오시는 길' }

const LOCATIONS = [
  {
    id: 'jeju',
    name: '본부 (제주캠프)',
    address: '제주특별자치도 제주시 애월읍 애납로 155',
    detail: '하람교회',
  },
  {
    id: 'seoul',
    name: '서울캠프',
    address: '서울특별시 은평구 진관3로 22',
    detail: '이로운프라자 6층 바로선개혁교회',
  },
]

export default function AboutDirectionsPage() {
  return (
    <>
      <PageHeader
        title="오시는 길"
        breadcrumbs={[{ label: '총회소개', href: '/about' }, { label: '오시는 길' }]}
        backgroundImage="/images/breadcrumb/john_calvin.jpg"
        bgColor="bg-slate-800"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        <div className="mb-2">
          <p className="text-xs font-semibold tracking-[0.25em] text-sky-600 uppercase mb-2">Directions</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">오시는 길</h2>
          <div className="mt-3 w-10 h-0.5 bg-sky-600 rounded-full" />
        </div>

        {LOCATIONS.map((loc) => (
          <section key={loc.id} className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-sky-600 shrink-0" />
              <h3 className="text-lg font-bold text-slate-900">{loc.name}</h3>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 h-72 sm:h-96">
              <KakaoMap address={loc.address} label={loc.name} />
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 space-y-1.5">
              <p className="text-sm text-slate-700">
                <span className="font-semibold text-slate-900">주소</span>
                {'  '}
                {loc.address}
              </p>
              <p className="text-sm text-slate-500 pl-8">{loc.detail}</p>
            </div>
          </section>
        ))}
      </div>
    </>
  )
}
