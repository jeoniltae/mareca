'use client'

import { Article } from './law-data'

interface ConstitutionArticleProps {
  article: Article
}

export function ConstitutionArticle({ article }: ConstitutionArticleProps) {
  const lines = article.content.split('\n')

  return (
    <div id={`article-${article.number}`} className="scroll-mt-32 border border-slate-200 rounded-lg overflow-hidden">
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-baseline gap-3">
        <span className="text-xs font-bold text-slate-400 shrink-0">{article.number}</span>
        <h3 className="text-sm font-semibold text-slate-700">{article.title}</h3>
      </div>
      <div className="px-5 py-4 text-sm text-slate-600 leading-relaxed space-y-2">
        {lines.map((line, i) => {
          if (line === '') return null
          const isNumbered = /^\d+\./.test(line.trim())
          return (
            <p
              key={i}
              className={isNumbered ? 'pl-4 text-slate-500' : ''}
            >
              {line}
            </p>
          )
        })}
      </div>
    </div>
  )
}
