import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: '마스터스개혁파총회',
    short_name: '마스터스개혁파총회',
    description: '성경의 진리 위에 세워진 개혁파 신앙 공동체 — 마스터스개혁파총회(MRA)입니다.',
    // id를 생략하면 앱 식별자가 start_url로 결정된다. start_url을 바꾸는 순간
    // 브라우저가 다른 앱으로 인식해 기존 설치자에게 중복 아이콘이 생기므로 고정한다.
    id: '/',
    // 홈 화면 아이콘으로 실행한 방문을 일반 웹 방문과 구분하기 위한 표식
    start_url: '/?utm_source=pwa',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1C2E50',
    lang: 'ko',
    icons: [
      {
        src: '/images/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/images/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
