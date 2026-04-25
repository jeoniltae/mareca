import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Home } from 'lucide-react'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  breadcrumbs?: BreadcrumbItem[]
  backgroundImage?: string
  bgColor?: string
  imagePosition?: string
}

export function PageHeader({ title, breadcrumbs = [], backgroundImage, bgColor = 'bg-slate-800', imagePosition }: PageHeaderProps) {
  return (
    <div className={`relative ${bgColor} text-white overflow-hidden`}>
      {backgroundImage && (
        <Image
          src={backgroundImage}
          alt=""
          fill
          className="object-cover opacity-30"
          style={imagePosition ? { objectPosition: imagePosition } : undefined}
          priority
        />
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:h-[280px] sm:flex sm:flex-col sm:justify-center">
        <h1 className="text-3xl font-bold mb-3">{title}</h1>

        {/* 브레드크럼 */}
        <nav aria-label="breadcrumb">
          <ol className="flex items-center gap-1 text-sm text-slate-400">
            <li className="tracking-[-1px]">
              <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                <Home size={14} />
                홈
              </Link>
            </li>
            {breadcrumbs.map((item, i) => (
              <li key={i} className="flex items-center gap-1 tracking-[-1px]">
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
