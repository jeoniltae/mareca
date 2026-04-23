import Link from 'next/link'
import { Phone } from 'lucide-react'
import { PolicyModals } from './PolicyModals'

export function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase mb-4">
              Contact Us
            </p>
            <ul className="space-y-2 text-base leading-relaxed">
              <li>본부(제주캠프): 제주특별자치도 제주시 애월읍 애납로 155 하람교회</li>
              <li>서울캠프: 서울특별시 은평구 진관3로 22 이로운프라자 6층 바로선개혁교회</li>
              <li className="pt-2 flex items-center gap-3 flex-wrap">
                <a
                  href="tel:010-8466-7247"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-sky-600 text-white text-sm font-semibold transition-colors"
                >
                  <Phone size={13} />
                  010-8466-7247
                </a>
                <span className="text-slate-400 text-sm">FAX 050-4271-7247</span>
              </li>
              <li>saemvithee@naver.com</li>
            </ul>
          </div>

          <div className="flex flex-col md:items-end gap-5">
            <Link href="/" className="flex items-center gap-2">
              <img src="/images/logo.jpg" alt="마스터스개혁파총회 로고" width={65} height={65} className="rounded object-cover" />
              <span className="text-white font-semibold text-base">마스터스개혁파총회</span>
            </Link>
            <PolicyModals />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-sm text-slate-500">
            © Copyright 2023. 마스터스개혁파총회 All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
