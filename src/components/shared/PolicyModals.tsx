'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'

type PolicyType = 'privacy' | 'nospam' | null

const POLICIES = {
  privacy: {
    title: '개인정보처리방침',
    content: (
      <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
        <p>마스터스개혁파총회(이하 "총회")는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.</p>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">1. 수집하는 개인정보 항목</h3>
          <p>총회는 로그인 인증 서비스 제공을 위해 다음의 개인정보를 수집합니다.</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>필수 항목: 이메일 주소</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">2. 개인정보의 수집 및 이용 목적</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>회원 가입 및 로그인 인증</li>
            <li>게시판 서비스 이용 주체 식별</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">3. 개인정보의 보유 및 이용 기간</h3>
          <p>회원 탈퇴 시까지 보유합니다. 단, 관계 법령에 따라 보존이 필요한 경우에는 해당 법령에서 정한 기간 동안 보유합니다.</p>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">4. 개인정보의 제3자 제공</h3>
          <p>총회는 수집한 개인정보를 제3자에게 제공하지 않습니다.</p>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">5. 개인정보의 안전성 확보 조치</h3>
          <p>총회는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>개인정보는 암호화하여 저장 및 관리</li>
            <li>Supabase(미국) 서버를 통한 보안 인증 처리</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">6. 정보주체의 권리</h3>
          <p>정보주체는 언제든지 개인정보 열람·정정·삭제·처리정지를 요구할 수 있습니다.</p>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">7. 개인정보 보호책임자</h3>
          <ul className="space-y-1">
            <li>기관명: 마스터스개혁파총회</li>
            <li>이메일: saemvithee@naver.com</li>
            <li>전화: 010-8466-7247</li>
          </ul>
        </section>

        <p className="text-xs text-slate-400 pt-2">본 방침은 2026년 4월 14일부터 시행됩니다.</p>
      </div>
    ),
  },
  nospam: {
    title: '이메일무단수집거부',
    content: (
      <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
        <p>
          본 웹사이트에 게시된 이메일 주소가 전자우편 수집 프로그램이나 그 밖의 기술적 장치를 이용하여
          무단으로 수집되는 것을 거부하며, 이를 위반 시 정보통신망법에 의해 형사 처벌될 수 있습니다.
        </p>

        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <p className="font-semibold text-slate-800 mb-2">관련 법령</p>
          <p className="text-xs text-slate-500">
            정보통신망 이용촉진 및 정보보호 등에 관한 법률 제50조의2(전자우편주소의 무단 수집행위 등 금지)
          </p>
          <ul className="mt-2 text-xs text-slate-500 space-y-1 list-disc pl-4">
            <li>누구든지 전자우편주소의 수집을 거부하는 의사가 명시된 인터넷 홈페이지에서 자동으로 전자우편주소를 수집하는 프로그램 그 밖의 기술적 장치를 이용하여 전자우편주소를 수집하여서는 아니됩니다.</li>
            <li>이를 위반하여 전자우편주소를 수집·판매·유통하거나 이를 이용한 정보 전송 시 1천만원 이하의 과태료가 부과됩니다.</li>
          </ul>
        </div>

        <p className="font-medium text-slate-700">
          마스터스개혁파총회는 이용자의 개인정보를 소중히 여기며, 이메일 무단 수집으로 인한 피해가 발생하지 않도록 최선을 다하고 있습니다.
        </p>

        <p className="text-xs text-slate-400">게시일: 2026년 4월 14일</p>
      </div>
    ),
  },
}

export function PolicyModals() {
  const [open, setOpen] = useState<PolicyType>(null)
  const policy = open ? POLICIES[open] : null

  useBodyScrollLock(open !== null)

  return (
    <>
      <div className="text-sm text-slate-400 flex items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen('privacy')}
          className="hover:text-white transition-colors"
        >
          개인정보처리방침
        </button>
        <span>|</span>
        <button
          type="button"
          onClick={() => setOpen('nospam')}
          className="hover:text-white transition-colors"
        >
          이메일무단수집거부
        </button>
      </div>

      <AnimatePresence>
        {open && policy && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setOpen(null)}
              aria-hidden="true"
            />
            <motion.div
              key="modal"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 28 } }}
              exit={{ opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.15 } }}
              className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-2xl flex flex-col max-h-[80vh]"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
                <h2 className="text-base font-semibold text-slate-900">{policy.title}</h2>
                <button
                  type="button"
                  onClick={() => setOpen(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="닫기"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="overflow-y-auto px-6 py-5">
                {policy.content}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
