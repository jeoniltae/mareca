import Link from 'next/link'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  breadcrumbs?: BreadcrumbItem[]
}

export function PageHeader({ title, breadcrumbs = [] }: PageHeaderProps) {
  return (
    <div className="bg-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold mb-3">{title}</h1>

        {/* 브레드크럼 */}
        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-1 text-sm text-slate-400">
            <li>
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                <Home size={14} />
                홈
              </Link>
            </li>
            {breadcrumbs.map((item, i) => (
              <li key={i} className="flex items-center gap-1">
                <ChevronRight size={12} className="text-slate-600" />
                {item.href ? (
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-slate-200">{item.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  )
}
