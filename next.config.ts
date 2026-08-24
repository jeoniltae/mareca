import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: '/posts/message', destination: '/community/message', permanent: true },
      { source: '/posts/voice', destination: '/community/voice', permanent: true },
      // 레거시 PHP 홈페이지 → 현재 홈으로 영구 이동 (Google 색인 정리용)
      { source: '/index.php', destination: '/', permanent: true },
      // 노회소식 → 클럽소식 개편(9718bdc)으로 삭제된 경로.
      // 삭제 후에도 검색 노출이 계속 발생해(GSC 3개월 38회) 404로 유실되던 것을 회수한다.
      { source: '/presbytery', destination: '/club-news/news', permanent: true },
      { source: '/presbytery/:path*', destination: '/club-news/news', permanent: true },
      // 개편 전 PHP 사이트의 경로들. 이 리포지토리 히스토리에는 없고(삭제된 라우트 기록도 없음)
      // 내부 링크도 남아있지 않지만, GSC 404 목록에 계속 잡히는 걸 보면 외부 백링크와 색인 이력이 살아있다.
      // /presbytery와 같은 이유로 회수한다.
      { source: '/about/greeting', destination: '/about/chairman', permanent: true },
      { source: '/posts/greeting', destination: '/about/chairman', permanent: true },
      { source: '/gallery', destination: '/community/album', permanent: true },
      { source: '/videos', destination: '/community/reformed-tv', permanent: true },
      { source: '/address', destination: '/about/directions', permanent: true },
      { source: '/resources/logo', destination: '/about/logo', permanent: true },
      // /membership, /support — 옛 사이트에서 어떤 페이지였는지 확인되지 않아 보류.
      // /resources/meeting, /resources/admin — 대응 페이지(/report/minutes, /online-admin)가
      // 로그인·이메일 제한이라 크롤러는 '/'로 튕긴다. 소프트 404가 되므로 404로 두는 편이 낫다.
    ];
  },
  turbopack: {},
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // LAN IP 접근 시 HMR WebSocket 허용 (모바일/다른 기기 테스트용)
  allowedDevOrigins: ['192.168.219.108'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '**.christiandaily.co.kr',
      },
      {
        protocol: 'http',
        hostname: '**.christiandaily.co.kr',
      },
      {
        protocol: 'https',
        hostname: '**.christiantoday.co.kr',
      },
    ],
  },
};

export default withPWA(nextConfig);
