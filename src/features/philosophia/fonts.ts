// 최더함의 철학시가 전용 서체 — 국문 명조(제목)와 라틴·숫자 모노(넘버링·메타). 이 코너 밖으로 번들되지 않도록 layout.tsx가 아니라 여기서 로드한다

import { Gowun_Batang, IBM_Plex_Mono } from 'next/font/google'

// 디자인을 지탱하는 디스플레이 서체라 프로젝트 관행인 optional 대신 swap을 쓴다 (optional은 로드가 늦으면 서체를 아예 포기한다)
export const batang = Gowun_Batang({
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
  preload: false,
})

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  preload: false,
})
