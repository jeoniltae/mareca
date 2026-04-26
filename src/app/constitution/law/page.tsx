'use client'

import { useState } from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { constitutionData } from './law-data'
import { ConstitutionContent } from './ConstitutionContent'

const TABS = constitutionData.map((s) => ({ id: s.id, title: s.title }))

export default function ConstitutionLawPage() {
  const [activeTab, setActiveTab] = useState(TABS[0].id)
  const activeSection = constitutionData.find((s) => s.id === activeTab)!

  return (
    <>
      <PageHeader
        title="총회헌법"
        breadcrumbs={[{ label: '총회헌법', href: '/constitution' }, { label: '총회헌법' }]}
        backgroundImage="/images/breadcrumb/john_calvin.jpg"
        bgColor="bg-slate-800"
        imagePosition="center 40%"
      />

      {/* 섹션 탭 — sticky */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                }`}
              >
                {tab.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <ConstitutionContent key={activeTab} section={activeSection} />
      </div>
    </>
  )
}
