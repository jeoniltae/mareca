'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Mail, ShieldCheck, Loader2, ArrowLeft, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

type Step =
  | { type: 'input' }
  | { type: 'link_sent' }
  | { type: 'otp_verify' }

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<Step>({ type: 'input' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  // 이미 로그인된 상태이면 홈으로 이동
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace('/')
    })
  }, [])

  async function handleSendLink() {
    if (!email) return
    setLoading(true)
    setError(null)
    const origin = location.origin.replace('//0.0.0.0', '//localhost')
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${origin}/auth/callback` },
    })
    setLoading(false)
    if (error) {
      setError(error.status === 429
        ? '이메일 발송 횟수를 초과했습니다. 잠시 후 다시 시도해주세요.'
        : '이메일 전송에 실패했습니다. 다시 시도해주세요.'
      )
    } else {
      setStep({ type: 'link_sent' })
    }
  }

  async function handleSendOtp() {
    if (!email) return
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.signInWithOtp({ email })
    setLoading(false)
    if (error) {
      setError(error.status === 429
        ? '이메일 발송 횟수(시간당 최대 2회)를 초과했습니다. 1시간 이후에 다시 시도해주세요.'
        : '이메일 전송에 실패했습니다. 다시 시도해주세요.'
      )
    } else {
      setStep({ type: 'otp_verify' })
    }
  }

  async function handleVerifyOtp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!otp.trim()) return
    setLoading(true)
    setError(null)
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: 'email',
    })
    setLoading(false)
    if (error) {
      setError('코드가 올바르지 않거나 만료되었습니다.')
      return
    }
    router.push('/')
    router.refresh()
  }

  // ── 링크 전송 완료 ─────────────────────────────────────────────────────────
  if (step.type === 'link_sent') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm text-center">
          <div className="py-8 px-6 bg-sky-50 rounded-2xl border border-sky-100">
            <Mail size={36} className="text-sky-500 mx-auto mb-4" />
            <p className="font-semibold text-slate-800 mb-1">이메일을 확인해주세요</p>
            <p className="text-sm text-slate-500">
              <strong className="text-slate-700">{email}</strong>으로<br />로그인 링크를 보냈습니다.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setStep({ type: 'input' })}
            className="mt-4 text-sm text-slate-400 hover:text-slate-600 flex items-center gap-1 mx-auto"
          >
            <ArrowLeft size={13} /> 다시 입력
          </button>
        </div>
      </div>
    )
  }

  // ── OTP 코드 입력 ──────────────────────────────────────────────────────────
  if (step.type === 'otp_verify') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sky-50 mb-4">
              <ShieldCheck size={22} className="text-sky-500" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">인증 코드 입력</h1>
            <p className="text-sm text-slate-500">
              <strong className="text-slate-700">{email}</strong>으로<br />
              8자리 인증 코드를 보냈습니다.
            </p>
          </div>

          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={8}
              required
              autoFocus
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="00000000"
              className="w-full px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition-all"
            />

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading || otp.length < 8}
              className="w-full flex items-center justify-center gap-2 py-3 bg-sky-600 text-white font-semibold text-sm rounded-xl hover:bg-sky-700 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : null}
              {loading ? '확인 중...' : '로그인'}
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
            <button
              type="button"
              onClick={() => { setStep({ type: 'input' }); setOtp(''); setError(null) }}
              className="hover:text-slate-600 flex items-center gap-1"
            >
              <ArrowLeft size={13} /> 다시 입력
            </button>
            <button
              type="button"
              onClick={handleSendOtp}
              className="hover:text-slate-600"
            >
              코드 재전송
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── 이메일 입력 (기본) ─────────────────────────────────────────────────────
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">로그인</h1>
          <p className="text-sm text-slate-500">이메일 주소를 입력하세요</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              이메일 주소
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-sky-300 transition-all"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="button"
            disabled={loading || !email}
            onClick={handleSendOtp}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 bg-sky-600 text-white font-semibold text-sm rounded-xl hover:bg-sky-700 transition-colors',
              (loading || !email) && 'opacity-60 cursor-not-allowed',
            )}
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
            {loading ? '전송 중...' : '인증 코드 받기'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200" />
            <span className="text-xs text-slate-400">또는</span>
            <div className="flex-1 h-px bg-slate-200" />
          </div>

          <button
            type="button"
            disabled={loading || !email}
            onClick={handleSendLink}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-3 border-2 border-sky-600 text-sky-600 text-sm font-semibold rounded-xl hover:bg-sky-50 transition-colors',
              (loading || !email) && 'opacity-60 cursor-not-allowed',
            )}
          >
            <Mail size={16} />
            로그인 링크 받기
          </button>

          <div className="flex gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertTriangle size={15} className="shrink-0 text-amber-500 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              로그인 시도가 2번 이상 넘어가면 이용 중인 서버 정책상 1시간 뒤에 재로그인이 가능합니다.<br />
              실수하지 않도록 자주 사용하는 이메일로 로그인해 주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
