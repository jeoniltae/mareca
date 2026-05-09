'use client'
// 게시판 공통 검색창 — 300ms 디바운스 후 URL ?q= 파라미터로 반영

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'

interface BoardSearchProps {
  defaultValue?: string
}

export function BoardSearch({ defaultValue = '' }: BoardSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [value, setValue] = useState(defaultValue)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setValue(defaultValue)
  }, [defaultValue])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const next = e.target.value
    setValue(next)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (next.trim()) {
        params.set('q', next.trim())
        params.delete('page')
      } else {
        params.delete('q')
        params.delete('page')
      }
      router.push(`${pathname}?${params.toString()}`)
    }, 300)
  }

  function handleClear() {
    setValue('')
    if (timerRef.current) clearTimeout(timerRef.current)
    const params = new URLSearchParams(searchParams.toString())
    params.delete('q')
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="relative">
      <Search
        size={15}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="제목으로 검색"
        className="w-full pl-10 pr-9 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 focus:bg-white transition-all"
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="검색어 지우기"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
