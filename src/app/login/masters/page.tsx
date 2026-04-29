'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { KeyRound, Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

const MASTERS_EMAIL = 'masters@mareca.kr'

export default function MastersLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!password) return
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: MASTERS_EMAIL,
      password,
    })

    setLoading(false)
    if (error) {
      setError('비밀번호가 올바르지 않습니다.')
      return
    }

    router.push('/resources')
    router.refresh()
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
            <KeyRound size={22} className="text-slate-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">목회자 전용 로그인</h1>
          <p className="text-sm text-slate-500">마스터스자료실 접근 비밀번호를 입력하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full px-4 py-3 pr-11 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-300 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 text-white font-semibold text-sm rounded-xl hover:bg-slate-900 transition-colors disabled:opacity-60"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : null}
            {loading ? '확인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft size={13} />
            일반 로그인으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
