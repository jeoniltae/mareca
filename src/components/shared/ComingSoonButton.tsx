'use client'

import { useState } from 'react'
import { ArrowRight, Hourglass, X } from 'lucide-react'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'

interface Props {
  label: string
  className?: string
}

export function ComingSoonButton({ label, className }: Props) {
  const [open, setOpen] = useState(false)

  useBodyScrollLock(open)

  return (
    <>
      <button onClick={() => setOpen(true)} className={className}>
        {label} <ArrowRight size={15} className="inline-block" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center px-4"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
                <Hourglass size={32} className="text-amber-400" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2">준비 중입니다</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              현재 해당 기능을 준비하고 있습니다.
              <br />
              빠른 시일 내에 오픈할 예정입니다.
            </p>

            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  )
}
