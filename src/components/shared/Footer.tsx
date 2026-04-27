'use client'

import Link from 'next/link'
import { Phone, Copy, Check } from 'lucide-react'
import { PolicyModals } from './PolicyModals'
import { useState } from 'react'

const ACCOUNT_NUMBER = '020-153222-04-015'

function CopyAccountButton() {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(ACCOUNT_NUMBER).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="shrink-0 flex items-center gap-1 px-2 py-1 rounded bg-slate-700 hover:bg-sky-600 text-slate-300 hover:text-white text-xs transition-colors"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? '복사됨' : '복사'}
    </button>
  )
}

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

            {/* 후원 계좌 */}
            <div className="md:text-right">
              <p className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
                후원 계좌
              </p>
              <p className="flex items-center gap-1.5 text-sm text-slate-300 mb-1 md:justify-end">
                <img src="/images/logo_ibk.svg" alt="기업은행" width={18} height={18} className="inline-block" />
                기업은행 · 사단법인 마스터스개혁파총회
              </p>
              <div className="flex items-center gap-2 md:justify-end">
                <span className="text-white font-mono font-semibold text-sm">{ACCOUNT_NUMBER}</span>
                <CopyAccountButton />
              </div>
            </div>

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
