'use client'

// 홈 화면에 앱 아이콘 추가를 유도하는 배너 (Android는 설치 프롬프트, iOS는 수동 안내 모달)

import { useEffect, useState, useSyncExternalStore } from 'react'
import { Share, Plus, Smartphone, X } from 'lucide-react'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'
import { useModalStore } from '@/hooks/use-modal-store'

// Chrome 계열에서만 발생하는 비표준 이벤트라 타입을 직접 정의한다.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'a2hs-dismissed'

// 이미 홈 화면에서 실행 중이면(standalone) 배너를 띄울 이유가 없다.
function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

// iPadOS 13+는 UA를 Macintosh로 보내므로 터치 지원 여부로 함께 판별한다.
function isIOS() {
  const ua = window.navigator.userAgent
  return (
    /iphone|ipad|ipod/i.test(ua) ||
    (/macintosh/i.test(ua) && window.navigator.maxTouchPoints > 1)
  )
}

type Env = 'blocked' | 'ios' | 'installable'

// 값이 바뀌지 않으므로 구독하지 않는다. 참조 안정성을 위해 모듈 스코프에 둔다.
const subscribeEnv = () => () => {}
const getEnvServerSnapshot = (): Env => 'blocked'

function getEnvSnapshot(): Env {
  if (isStandalone()) return 'blocked'
  if (localStorage.getItem(DISMISS_KEY)) return 'blocked'
  return isIOS() ? 'ios' : 'installable'
}

// ─── 설치 프롬프트 보관소 ───────────────────────────────────────────────────────
// `beforeinstallprompt`는 페이지 로드당 한 번만 발생하고 클라이언트 라우팅으로는
// 재발생하지 않는다. 게다가 이 컴포넌트의 청크는 메인 페이지를 렌더할 때 비로소
// 로드되므로, 서브 페이지로 첫 진입하면 리스너를 달기도 전에 이벤트가 지나간다.
// 그래서 실제 수신은 layout.tsx의 인라인 스크립트가 하이드레이션 이전에 처리하고,
// 여기서는 보관된 값을 구독만 한다.
declare global {
  interface Window {
    __installPrompt?: BeforeInstallPromptEvent | null
  }
}

function subscribePrompt(cb: () => void) {
  window.addEventListener('installpromptready', cb)
  return () => window.removeEventListener('installpromptready', cb)
}
const getPromptSnapshot = () => window.__installPrompt != null
const getPromptServerSnapshot = () => false

export function AddToHomeScreen() {
  // 브라우저 환경 판별은 렌더 중 한 번 읽으면 되는 외부 상태다.
  // useEffect + setState로 처리하면 cascading render가 되므로 스냅샷으로 읽는다.
  const env = useSyncExternalStore(subscribeEnv, getEnvSnapshot, getEnvServerSnapshot)
  const promptReady = useSyncExternalStore(
    subscribePrompt,
    getPromptSnapshot,
    getPromptServerSnapshot
  )

  const [dismissed, setDismissed] = useState(false)
  const [guideOpen, setGuideOpen] = useState(false)
  const setModalOpen = useModalStore((s) => s.setModalOpen)

  useBodyScrollLock(guideOpen)

  useEffect(() => {
    setModalOpen(guideOpen)
    return () => setModalOpen(false)
  }, [guideOpen, setModalOpen])

  const handleInstall = async () => {
    if (env === 'ios') {
      setGuideOpen(true)
      return
    }

    const event = window.__installPrompt
    if (!event) return

    await event.prompt()
    const { outcome } = await event.userChoice
    // 한 번 사용한 이벤트는 재사용할 수 없다. 비워서 배너를 내린다.
    window.__installPrompt = null
    window.dispatchEvent(new Event('installpromptready'))
    if (outcome === 'accepted') setDismissed(true)
  }

  const handleDismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1')
    setDismissed(true)
  }

  const visible = !dismissed && (env === 'ios' || (env === 'installable' && promptReady))
  if (!visible) return null

  return (
    <>
      <section className="bg-sky-50 border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <span className="hidden sm:flex shrink-0 items-center justify-center w-10 h-10 rounded-full bg-white text-sky-600 border border-sky-100">
              <Smartphone size={18} />
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-800">홈 화면에 추가하기</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                앱처럼 바로 열 수 있습니다. 총회 소식을 더 빠르게 확인하세요.
              </p>
            </div>

            <button
              type="button"
              onClick={handleInstall}
              className="shrink-0 px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-medium hover:bg-sky-700 transition-colors"
            >
              추가
            </button>

            <button
              type="button"
              onClick={handleDismiss}
              className="shrink-0 p-1 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="배너 닫기"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </section>

      {guideOpen && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center px-4"
          onClick={() => setGuideOpen(false)}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setGuideOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="닫기"
            >
              <X size={18} />
            </button>

            <h3 className="text-lg font-bold text-slate-800 mb-1">홈 화면에 추가</h3>
            <p className="text-sm text-slate-500 mb-5">
              아래 순서대로 진행하면 바탕화면에 아이콘이 생깁니다.
            </p>

            <ol className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center">
                  1
                </span>
                <p className="text-sm text-slate-600 leading-relaxed">
                  화면 아래 <Share size={14} className="inline-block mx-0.5 -mt-0.5 text-sky-600" />
                  <span className="font-medium text-slate-800"> 공유</span> 버튼을 누릅니다.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <p className="text-sm text-slate-600 leading-relaxed">
                  목록을 내려서 <Plus size={14} className="inline-block mx-0.5 -mt-0.5 text-sky-600" />
                  <span className="font-medium text-slate-800"> 홈 화면에 추가</span>를 선택합니다.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-sky-100 text-sky-700 text-xs font-bold flex items-center justify-center">
                  3
                </span>
                <p className="text-sm text-slate-600 leading-relaxed">
                  오른쪽 위 <span className="font-medium text-slate-800">추가</span>를 누르면 완료됩니다.
                </p>
              </li>
            </ol>

            <p className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-400 leading-relaxed">
              공유 버튼이 보이지 않으면 사파리(Safari)로 접속해 주세요. 카카오톡·네이버 등
              앱 내부 브라우저에서는 홈 화면에 추가할 수 없습니다.
            </p>

            <button
              type="button"
              onClick={() => setGuideOpen(false)}
              className="mt-5 w-full py-2.5 rounded-xl bg-slate-800 text-white text-sm font-medium hover:bg-slate-700 transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  )
}
