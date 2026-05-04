import Image from 'next/image'
import { PageHeader } from '@/components/shared/PageHeader'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '임원',
  description: '마스터스개혁파총회 임원진 및 주요 직책자를 소개합니다.',
  openGraph: { title: '임원', description: '마스터스개혁파총회 임원진 및 주요 직책자를 소개합니다.', url: '/about/officers' },
}

type Member = { name: string; title: string; note?: string; image?: string }
type OfficerGroup = { role: string; members: Member[]; vacant?: boolean }

const OFFICERS: OfficerGroup[] = [
  {
    role: '고문',
    members: [
      { name: '박상경', title: '목사' },
      { name: '장광용', title: '교수' },
      { name: '서문 강', title: '목사'},
      // { name: '서문 강', title: '목사', image: '/images/seomun-gang.png' },
    ],
  },
  {
    role: '의장(임시)',
    members: [{ name: '최더함', title: '목사', image: '/images/choi_plus2.png' }],
  },
  {
    role: '대변인',
    members: [{ name: '공성권', title: '목사', image: '/images/gong_seong_gwon.png' }],
  },
  {
    role: '총무',
    members: [{ name: '김경수', title: '목사', image: '/images/kim_kyung_soo.png' }],
  },
  {
    role: '마스터스클럽 회장',
    members: [{ name: '송연수', title: '목사', image: '/images/song_yeon_su.png' }],
  },
  {
    role: '본부팀장',
    members: [{ name: '최상권', title: '목사', image: '/images/choi_sang_kwon.png' }],
  },
  {
    role: '선교팀장',
    members: [
      { name: '최상권', title: '목사', note: '(팀장)', image: '/images/choi_sang_kwon.png' },
      { name: '신민철', title: '선교사' }
    ],
  },
  {
    role: '복지팀장',
    members: [
      { name: '안시은', title: '두손클럽 회장', note: '(팀장)' },
      { name: '박혜진', title: '제주팀장' },
    ],
  },
  {
    role: '교육팀장 (마스터스아카데미)',
    members: [{ name: '공성권', title: '목사', image: '/images/gong_seong_gwon.png' }],
  },
  {
    role: '마스터스세미너리',
    members: [{ name: '최더함', title: '', image: '/images/choi_plus2.png' }],
  },
  {
    role: '미디어팀',
    members: [
      { name: '전정태', title: '' }
    ],
  },
  {
    role: '건축팀장',
    members: [
      { name: '임현상', title: '목사', note: '(팀장)', image: '/images/im_hyun_sang.png' },
      { name: '임동균', title: '', note: '(부팀장)', image: '/images/lim_dong_gyun.png' },
    ],
  },
  {
    role: '데이터연구팀',
    members: [{ name: '공석', title: '' }],
    vacant: true,
  },
  {
    role: '재정팀장',
    members: [{ name: '최희진', title: '', image: '/images/choi_hee_jin.png' }],
  },
]

function PersonIcon() {
  return (
    <svg
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden="true"
    >
      <circle cx="40" cy="40" r="40" fill="#E2E8F0" />
      <circle cx="40" cy="30" r="14" fill="#94A3B8" />
      <ellipse cx="40" cy="70" rx="22" ry="16" fill="#94A3B8" />
    </svg>
  )
}

function OfficerCard({ name, title, note, image }: { name: string; title: string; note?: string; image?: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="w-20 h-20 rounded-full overflow-hidden mb-3 ring-2 ring-slate-200">
        {image ? (
          <Image src={image} alt={name} width={80} height={80} className="w-full h-full object-cover object-top" />
        ) : (
          <PersonIcon />
        )}
      </div>
      <p className="font-semibold text-slate-800 text-sm leading-tight">{name}</p>
      {title && <p className="text-xs text-slate-500 mt-0.5">{title}</p>}
      {note && <p className="text-xs text-sky-600 mt-0.5">{note}</p>}
    </div>
  )
}

export default function AboutOfficersPage() {
  return (
    <>
      <PageHeader
        title="임원"
        breadcrumbs={[{ label: '총회소개', href: '/about' }, { label: '임원' }]}
        backgroundImage="/images/breadcrumb/john_calvin.jpg"
        bgColor="bg-slate-800"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="mb-10">
          <p className="text-xs font-semibold tracking-[0.25em] text-sky-600 uppercase mb-2">Officers</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">임원</h2>
          <div className="mt-3 w-10 h-0.5 bg-sky-600 rounded-full" />
          <p className="mt-4 text-sm text-slate-500">Masters Reformed Assembly</p>
        </div>

        <div className="space-y-6">
          {OFFICERS.map((group) => (
            <div
              key={group.role}
              className="rounded-2xl border border-slate-200 overflow-hidden"
            >
              <div className="px-5 py-3" style={{ backgroundColor: '#C8A224' }}>
                <h3 className="text-sm font-bold text-white tracking-wide">{group.role}</h3>
              </div>
              <div className="px-3 sm:px-6 py-5 bg-white">
                {group.vacant ? (
                  <p className="text-sm text-slate-400 italic">공석</p>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {group.members.map((member) => (
                      <OfficerCard
                        key={`${member.name}-${group.role}`}
                        name={member.name}
                        title={member.title}
                        note={member.note}
                        image={member.image}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
