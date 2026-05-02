'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

interface ShareButtonsProps {
  title: string
  description?: string
  imageUrl?: string
}

export function ShareButtons({ title, description, imageUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  function handleCopyLink() {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleKakaoShare() {
    if (!window.Kakao?.Share) return
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title,
        description: description ?? '마스터스개혁파총회',
        imageUrl: imageUrl ?? `${window.location.origin}/images/logo.png`,
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
    })
  }

  return (
    <div className="flex items-center gap-2">
      {/* 카카오톡 공유 */}
      <button
        type="button"
        onClick={handleKakaoShare}
        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FEE500] text-[#191919] text-sm font-semibold hover:bg-[#F5DC00] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C6.48 3 2 6.69 2 11.25c0 2.91 1.88 5.47 4.72 6.97l-.88 3.25a.5.5 0 0 0 .73.55l3.85-2.56A11.6 11.6 0 0 0 12 19.5c5.52 0 10-3.69 10-8.25S17.52 3 12 3z" />
        </svg>
        카카오톡 공유
      </button>

      {/* 링크 복사 */}
      <button
        type="button"
        onClick={handleCopyLink}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors"
      >
        {copied ? (
          <>
            <Check size={14} className="text-emerald-500" />
            <span className="text-emerald-600">복사됨</span>
          </>
        ) : (
          <>
            <Link2 size={14} />
            링크 복사
          </>
        )}
      </button>
    </div>
  )
}
