'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

interface Props {
  url: string
}

export function ArticleShareButton({ url }: Props) {
  const [copied, setCopied] = useState(false)

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 transition-colors"
      aria-label="링크 복사"
    >
      {copied ? (
        <Check size={12} className="text-emerald-500" />
      ) : (
        <Link2 size={12} />
      )}
      {copied ? '복사됨' : '링크 복사'}
    </button>
  )
}
