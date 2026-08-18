'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'
import { useModalStore } from '@/hooks/use-modal-store'

type PolicyType = 'terms' | 'privacy' | 'nospam' | null

const POLICIES = {
  terms: {
    title: '이용약관',
    content: (
      <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
        <p>본 약관은 마스터스개혁파총회(이하 &quot;총회&quot;)가 운영하는 웹사이트(이하 &quot;서비스&quot;)의 이용 조건과 절차, 총회와 회원의 권리·의무 및 책임 사항을 정하는 것을 목적으로 합니다.</p>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">제1조 (약관의 효력 및 변경)</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>본 약관은 서비스 화면에 게시함으로써 효력이 발생합니다.</li>
            <li>총회는 필요한 경우 관계 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 시행일을 명시하여 게시합니다.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">제2조 (회원가입 및 계정)</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>서비스는 이메일 인증 링크 또는 비밀번호를 통한 로그인 방식을 제공하며, 별도의 회원가입 절차 없이 최초 로그인 시 회원으로 등록됩니다.</li>
            <li>회원은 본인의 계정을 제3자에게 양도하거나 대여할 수 없습니다.</li>
            <li>계정 관리 소홀로 발생한 문제에 대한 책임은 회원 본인에게 있습니다.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">제3조 (회원의 의무)</h3>
          <p>회원은 다음 각 호의 행위를 하여서는 안 됩니다.</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>타인을 비방하거나 명예를 훼손하는 내용의 게시</li>
            <li>욕설, 음란물, 혐오 표현 등 미풍양속에 반하는 내용의 게시</li>
            <li>타인의 저작권, 초상권 등 권리를 침해하는 내용의 게시</li>
            <li>서비스의 취지와 무관한 광고, 홍보, 상업적 목적의 게시</li>
            <li>허위 사실의 유포 및 타인의 개인정보 무단 게시</li>
            <li>서비스의 정상적인 운영을 방해하는 일체의 행위</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">제4조 (게시물의 관리)</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>회원은 본인이 작성한 게시물을 직접 수정하거나 삭제할 수 있습니다.</li>
            <li>총회는 게시물이 제3조 각 호에 해당하거나 관계 법령을 위반한다고 판단되는 경우, 사전 통지 없이 해당 게시물을 삭제하거나 노출을 제한할 수 있습니다.</li>
            <li>총회는 서비스 운영상 필요한 경우 게시판의 분류를 변경하거나 게시물을 이동할 수 있습니다.</li>
            <li>게시물 삭제에 이의가 있는 회원은 제8조의 연락처를 통해 사유를 문의할 수 있습니다.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">제5조 (게시물의 저작권)</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>회원이 작성한 게시물의 저작권은 해당 회원에게 있습니다.</li>
            <li>회원은 게시물을 등록함으로써 총회가 서비스 내에서 해당 게시물을 노출·보관·복제하는 것에 동의한 것으로 봅니다.</li>
            <li>총회가 게시물을 서비스 외부(소식지, 홍보 자료 등)에 이용하고자 할 경우에는 사전에 회원의 동의를 받습니다.</li>
            <li>회원이 게시한 내용으로 인해 제3자와 분쟁이 발생한 경우, 그 책임은 게시한 회원에게 있습니다.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">제6조 (서비스의 제공 및 변경)</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>서비스는 무료로 제공되며, 연중무휴 이용을 원칙으로 합니다.</li>
            <li>총회는 시스템 점검, 설비 교체, 통신 장애 등의 사유가 있는 경우 서비스 제공을 일시적으로 중단할 수 있습니다.</li>
            <li>총회는 서비스의 내용이나 게시판 구성을 변경할 수 있으며, 중요한 변경 사항은 사전에 공지합니다.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">제7조 (이용 제한 및 회원 탈퇴)</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>회원은 언제든지 탈퇴를 요청할 수 있으며, 총회는 지체 없이 이를 처리합니다.</li>
            <li>총회는 회원이 제3조의 의무를 반복적으로 위반하는 경우 서비스 이용을 제한할 수 있습니다.</li>
            <li>탈퇴 후에도 이미 게시된 게시물은 삭제되지 않을 수 있으며, 삭제를 원하는 경우 탈퇴 전에 직접 삭제하여야 합니다.</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">제8조 (면책 및 문의)</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>총회는 천재지변, 정전, 서비스 제공 업체의 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.</li>
            <li>총회는 회원 간 또는 회원과 제3자 간에 발생한 분쟁에 개입하지 않으며, 그로 인한 손해를 배상할 책임을 지지 않습니다.</li>
            <li>서비스 이용과 관련한 문의는 아래 연락처로 접수할 수 있습니다.</li>
          </ul>
          <ul className="mt-2 space-y-1">
            <li>이메일: saemvithee@naver.com</li>
            <li>전화: 010-8466-7247</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">제9조 (준거법 및 관할)</h3>
          <p>본 약관은 대한민국 법령에 따라 해석되며, 서비스 이용과 관련하여 분쟁이 발생한 경우 민사소송법에 따른 관할 법원에 제기합니다.</p>
        </section>

        <p className="text-xs text-slate-400 pt-2">본 약관은 2026년 4월 14일부터 시행됩니다.</p>
      </div>
    ),
  },
  privacy: {
    title: '개인정보처리방침',
    content: (
      <div className="space-y-5 text-sm text-slate-600 leading-relaxed">
        <p>마스터스개혁파총회(이하 &quot;총회&quot;)는 개인정보 보호법 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 다음과 같이 개인정보처리방침을 수립·공개합니다.</p>

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
          <p>서비스 이용 기간 동안 보유합니다. 단, 관계 법령에 따라 보존이 필요한 경우에는 해당 법령에서 정한 기간 동안 보유합니다.</p>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">4. 개인정보의 제3자 제공</h3>
          <p>총회는 수집한 개인정보를 제3자에게 제공하지 않습니다.</p>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">5. 개인정보의 국외 이전</h3>
          <p>총회는 인증 서비스 운영을 위해 아래와 같이 개인정보를 국외에 이전합니다.</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>이전받는 자: Supabase, Inc.</li>
            <li>이전 국가: 미국</li>
            <li>이전 항목: 이메일 주소</li>
            <li>이전 목적: 회원 인증 및 데이터 저장</li>
            <li>보유 기간: 서비스 이용 기간 동안</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">6. 개인정보의 안전성 확보 조치</h3>
          <p>총회는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.</p>
          <ul className="list-disc pl-5 mt-1 space-y-1">
            <li>개인정보는 암호화하여 저장 및 관리</li>
            <li>Supabase(미국) 서버를 통한 보안 인증 처리</li>
          </ul>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">7. 정보주체의 권리</h3>
          <p>정보주체는 언제든지 개인정보 열람·정정·삭제·처리정지를 요구할 수 있습니다.</p>
        </section>

        <section>
          <h3 className="font-semibold text-slate-800 mb-2">8. 개인정보 보호책임자</h3>
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
  const setModalOpen = useModalStore((s) => s.setModalOpen)

  useBodyScrollLock(open !== null)

  useEffect(() => {
    setModalOpen(open !== null)
    return () => setModalOpen(false)
  }, [open, setModalOpen])

  return (
    <>
      <div className="text-sm text-slate-400 flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setOpen('terms')}
          className="hover:text-white transition-colors"
        >
          이용약관
        </button>
        <span>|</span>
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
