import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    // 유틸 함수 단위 테스트만 한다(컴포넌트/E2E 없음 — CLAUDE.md의 의도적 결정).
    // jsdom으로 두면 미설치 의존성 때문에 테스트 자체가 실행되지 않는다
    environment: 'node',
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
