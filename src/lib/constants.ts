export const YEAR_CATEGORIES = ['2026년도', '2025년도', '2024년도', '2023년도', '2022년도'] as const
export type YearCategory = typeof YEAR_CATEGORIES[number]

/**
 * 공유 썸네일 기본 이미지.
 * 페이지에서 openGraph를 선언하면 루트 layout의 openGraph가 통째로 대체되어 og:image가 사라진다.
 * (Next.js metadata는 필드 단위 얕은 병합) 그래서 openGraph를 쓰는 페이지마다 명시해야 한다.
 * 상대 경로는 루트 layout의 metadataBase 기준으로 절대 URL로 변환된다.
 */
export const OG_IMAGE = { url: '/images/logo.png', alt: '마스터스개혁파총회 로고' } as const
