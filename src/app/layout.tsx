import type { Metadata } from 'next'
import { Noto_Sans_KR } from 'next/font/google'
import './globals.css'
import { organizationJsonLd, websiteJsonLd } from '@/lib/json-ld'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { KakaoScript } from '@/components/shared/KakaoScript'
import { NavigationProgress } from '@/components/shared/NavigationProgress'
import { NavigationTracker } from '@/components/shared/NavigationTracker'
import { Suspense } from 'react'
import { ViewTransitions } from 'next-view-transitions'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'optional',
  preload: false,
})

// scripts/generate-apple-splash.mjs로 생성된 public/images/splash/* 와 1:1 대응 (세로 모드만)
const APPLE_SPLASH_DEVICES = [
  { width: 375, height: 667, ratio: 2 },
  { width: 414, height: 736, ratio: 3 },
  { width: 375, height: 812, ratio: 3 },
  { width: 414, height: 896, ratio: 2 },
  { width: 414, height: 896, ratio: 3 },
  { width: 390, height: 844, ratio: 3 },
  { width: 428, height: 926, ratio: 3 },
  { width: 393, height: 852, ratio: 3 },
  { width: 430, height: 932, ratio: 3 },
  { width: 402, height: 874, ratio: 3 },
  { width: 440, height: 956, ratio: 3 },
]

const APPLE_SPLASH_SCREENS = APPLE_SPLASH_DEVICES.map(({ width, height, ratio }) => ({
  url: `/images/splash/apple-splash-${width * ratio}x${height * ratio}.png`,
  media: `(device-width: ${width}px) and (device-height: ${height}px) and (-webkit-device-pixel-ratio: ${ratio}) and (orientation: portrait)`,
}))

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    template: '%s | 마스터스개혁파총회',
    default: '마스터스개혁파총회',
  },
  description: '마스터스개혁파총회(MRA)는 개혁주의 신앙과 성경의 진리 위에 세워진 한국 개혁파 교회 총회입니다. 총회 소식, 신앙 자료, 교회 공동체 정보를 제공합니다.',
  alternates: { canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/` },
  verification: { google: '8lMq-ufKYoKg__zKzSCxUatg766qkeUtLP7FDf6Q13Q', other: { 'naver-site-verification': ['505895a38cdbe364b7030cfc92139f2f331f129e'] } },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '마스터스개혁파총회',
    startupImage: APPLE_SPLASH_SCREENS,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: '마스터스개혁파총회',
    title: {
      template: '%s | 마스터스개혁파총회',
      default: '마스터스개혁파총회',
    },
    description: '마스터스개혁파총회(MRA)는 개혁주의 신앙과 성경의 진리 위에 세워진 한국 개혁파 교회 총회입니다. 총회 소식, 신앙 자료, 교회 공동체 정보를 제공합니다.',
    images: [{ url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`, alt: '마스터스개혁파총회 로고' }],
  },
  twitter: {
    card: 'summary',
    title: {
      template: '%s | 마스터스개혁파총회',
      default: '마스터스개혁파총회',
    },
    description: '마스터스개혁파총회(MRA)는 개혁주의 신앙과 성경의 진리 위에 세워진 한국 개혁파 교회 총회입니다. 총회 소식, 신앙 자료, 교회 공동체 정보를 제공합니다.',
    images: ['/images/logo.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <html lang="ko" className={`${notoSansKR.variable} h-full antialiased`}>
        <body className="min-h-full flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <ScrollToTop />
          <KakaoScript />
          <NavigationProgress />
          <Suspense fallback={null}><NavigationTracker /></Suspense>
          <Analytics />
          <SpeedInsights />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify([organizationJsonLd(), websiteJsonLd()]) }}
          />
        </body>
      </html>
    </ViewTransitions>
  )
}
