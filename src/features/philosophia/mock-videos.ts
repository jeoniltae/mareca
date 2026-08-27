// 최더함의 철학시가 목록 화면 디자인 검토용 목업 데이터 — Supabase 연동 전까지만 사용한다

export interface PhilosophiaVideo {
  id: string
  title: string
  /** 카드 우측 상단에 표기되는 연작 라벨 */
  series: string
  category: '일반' | '숏츠'
  createdAt: string
  views: number
}

export const MOCK_VIDEOS: PhilosophiaVideo[] = [
  { id: 'mock-1', title: '바람이 지나간 자리', series: '존재편', category: '일반', createdAt: '2026.08.21', views: 128 },
  { id: 'mock-2', title: '흙에서 왔으니', series: '유한편', category: '일반', createdAt: '2026.08.19', views: 94 },
  { id: 'mock-3', title: '내가 나를 묻는 밤', series: '자아편', category: '숏츠', createdAt: '2026.08.17', views: 231 },
  { id: 'mock-4', title: '시간은 누구의 것인가', series: '시간편', category: '일반', createdAt: '2026.08.14', views: 77 },
  { id: 'mock-5', title: '빛보다 먼저 있던 말', series: '로고스편', category: '일반', createdAt: '2026.08.11', views: 305 },
  { id: 'mock-6', title: '그림자도 길을 안다', series: '섭리편', category: '숏츠', createdAt: '2026.08.08', views: 142 },
  { id: 'mock-7', title: '무너진 바벨에서', series: '언어편', category: '일반', createdAt: '2026.08.05', views: 58 },
  { id: 'mock-8', title: '마지막 물음', series: '종말편', category: '숏츠', createdAt: '2026.08.02', views: 189 },
]
