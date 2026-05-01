'use client'

import { useState, useEffect, useRef } from 'react'
import { Share2, Link2, Check } from 'lucide-react'

const CLOSE_EVENT = 'press-share-close'

interface Props {
  url: string
  title: string
  imageUrl: string | null
}

export function ArticleShareButton({ url, title, imageUrl }: Props) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)
  const id = useRef(Math.random().toString(36).slice(2))

  useEffect(() => {
    const handler = (e: Event) => {
      if ((e as CustomEvent).detail !== id.current) setOpen(false)
    }
    window.addEventListener(CLOSE_EVENT, handler)
    return () => window.removeEventListener(CLOSE_EVENT, handler)
  }, [])

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const next = !open
    if (next) window.dispatchEvent(new CustomEvent(CLOSE_EVENT, { detail: id.current }))
    setOpen(next)
  }

  function handleKakao(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!window.Kakao?.Share) return
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description: '마스터스개혁파총회 관련기사',
        imageUrl: imageUrl ?? `${window.location.origin}/images/logo.jpg`,
        link: { mobileWebUrl: url, webUrl: url },
      },
    })
    setOpen(false)
  }

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true)
        setTimeout(() => { setCopied(false); setOpen(false) }, 2000)
      })
    } else {
      const el = document.createElement('textarea')
      el.value = url
      el.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(el)
      el.focus(); el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => { setCopied(false); setOpen(false) }, 2000)
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        aria-label="공유"
      >
        <Share2 size={12} />
        공유
      </button>

      {open && (
        <div className="absolute bottom-7 right-0 z-10 flex flex-col gap-1 bg-white border border-slate-200 rounded-xl shadow-lg p-2 min-w-[130px]">
          <button
            type="button"
            onClick={handleKakao}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#FEE500] text-[#191919] text-xs font-semibold hover:bg-[#F5DC00] transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.48 3 2 6.69 2 11.25c0 2.91 1.88 5.47 4.72 6.97l-.88 3.25a.5.5 0 0 0 .73.55l3.85-2.56A11.6 11.6 0 0 0 12 19.5c5.52 0 10-3.69 10-8.25S17.52 3 12 3z" />
            </svg>
            카카오톡
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-colors"
          >
            {copied ? (
              <><Check size={12} className="text-emerald-500" /><span className="text-emerald-600">복사됨</span></>
            ) : (
              <><Link2 size={12} />링크 복사</>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
