import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { KakaoScript } from '@/components/shared/KakaoScript'
import { NavigationProgress } from '@/components/shared/NavigationProgress'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    template: '%s | 마스터스개혁파총회',
    default: '마스터스개혁파총회',
  },
  description: '성경의 진리 위에 세워진 개혁파 신앙 공동체 — 마스터스개혁파총회(MRA)입니다.',
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '마스터스개혁파총회',
    title: {
      template: '%s | 마스터스개혁파총회',
      default: '마스터스개혁파총회',
    },
    description: '성경의 진리 위에 세워진 개혁파 신앙 공동체 — 마스터스개혁파총회(MRA)입니다.',
    images: [{ url: '/images/logo.jpg', alt: '마스터스개혁파총회 로고' }],
  },
  twitter: {
    card: 'summary',
    title: {
      template: '%s | 마스터스개혁파총회',
      default: '마스터스개혁파총회',
    },
    description: '성경의 진리 위에 세워진 개혁파 신앙 공동체 — 마스터스개혁파총회(MRA)입니다.',
    images: ['/images/logo.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
        <KakaoScript />
        <NavigationProgress />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
