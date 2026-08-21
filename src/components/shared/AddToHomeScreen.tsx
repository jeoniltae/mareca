'use client'

// 홈 화면에 앱 아이콘 추가를 유도하는 배너 (Android는 설치 프롬프트, iOS는 수동 안내 모달)

import { useEffect, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Share, Plus, Download, X } from 'lucide-react'
import { useBodyScrollLock } from '@/hooks/use-body-scroll-lock'
import { useModalStore } from '@/hooks/use-modal-store'

// Chrome 계열에서만 발생하는 비표준 이벤트라 타입을 직접 정의한다.
type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISS_KEY = 'a2hs-dismissed'
/** 닫기 후 다시 노출하기까지의 기간(일). 영구 차단을 피해 재유입 기회를 남긴다. */
const DISMISS_DAYS = 7

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

// iOS Safari의 '모든 쿠키 차단' 설정에서는 localStorage에 접근하는 것만으로
// SecurityError가 던져진다. getEnvSnapshot은 렌더 단계에서 실행되므로 예외가
// 그대로 에러 바운더리까지 올라가 페이지 전체가 대체된다. 반드시 감싼다.
function isDismissedStored() {
  try {
    const raw = localStorage.getItem(DISMISS_KEY)
    if (!raw) return false

    const dismissedAt = Number(raw)
    // 숫자가 아니면 손상된 값이므로 만료된 것으로 보고 다시 노출한다.
    if (!Number.isFinite(dismissedAt)) return false

    return Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000
  } catch {
    return false
  }
}

function storeDismissed() {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()))
  } catch {
    // 프라이빗 모드 등에서 쓰기가 막혀도 현재 세션 동안의 숨김은 state로 유지된다.
  }
}

type Env = 'blocked' | 'ios' | 'installable'

// 값이 바뀌지 않으므로 구독하지 않는다. 참조 안정성을 위해 모듈 스코프에 둔다.
const subscribeEnv = () => () => {}
const getEnvServerSnapshot = (): Env => 'blocked'

function getEnvSnapshot(): Env {
  if (isStandalone()) return 'blocked'
  if (isDismissedStored()) return 'blocked'
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
  const setBannerOpen = useModalStore((s) => s.setBannerOpen)

  // 노출 조건을 따로 두지 않는다. 거슬리면 사용자가 X로 직접 닫을 수 있고,
  // 한 번 닫으면 localStorage에 기록돼 다시 뜨지 않는다.
  const visible = !dismissed && (env === 'ios' || (env === 'installable' && promptReady))

  useBodyScrollLock(guideOpen)

  useEffect(() => {
    setModalOpen(guideOpen)
    return () => setModalOpen(false)
  }, [guideOpen, setModalOpen])

  // 모바일에서는 하단 전체 폭이라 「맨 위로」 버튼과 겹친다.
  useEffect(() => {
    setBannerOpen(visible)
    return () => setBannerOpen(false)
  }, [visible, setBannerOpen])

  // 하단 고정 배너가 푸터 카피라이트를 가리므로, 문서 끝에 배너 높이만큼 여백을 만든다.
  useEffect(() => {
    document.body.classList.toggle('has-a2hs-banner', visible)
    return () => document.body.classList.remove('has-a2hs-banner')
  }, [visible])

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
    // state를 먼저 갱신한다. 저장이 실패해도 배너는 즉시 닫혀야 한다.
    setDismissed(true)
    storeDismissed()
  }

  return (
    <>
      {/*
        문서 흐름에 끼어들면 하이드레이션 직후 이하 콘텐츠가 밀려 CLS가 발생하므로
        고정 오버레이로 둔다.
        모바일: 하단 전체 폭 바 — 360px 폭에 5개 요소를 한 줄에 넣으면 잘린다.
        데스크톱(sm~): 좌측 하단 pill — 우측 하단은 「맨 위로」 버튼 자리다.
      */}
      <AnimatePresence>
        {visible && (
          <motion.div
            key="a2hs-banner"
            initial={{ y: 80, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
              transition: { type: 'spring', stiffness: 260, damping: 26 },
            }}
            exit={{ y: 80, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
            className="fixed inset-x-0 bottom-0 z-40 sm:inset-x-auto sm:bottom-5 sm:left-4"
          >
            {/* 모바일 총 높이 = h-14 + safe-area = globals.css의 --a2hs-banner-height.
                「맨 위로」 버튼 위치와 문서 하단 여백이 이 값을 참조하므로 함께 바꿔야 한다. */}
            <div className="border-t border-slate-700 bg-slate-900/95 pb-[env(safe-area-inset-bottom)] shadow-lg backdrop-blur-sm sm:rounded-xl sm:border sm:pb-0">
              <div className="flex h-14 items-center gap-2.5 px-4 sm:h-auto sm:gap-1.5 sm:py-1.5 sm:pl-2 sm:pr-1.5">
              <Image
                src="/images/icons/icon-192.png"
                alt=""
                width={24}
                height={24}
                className="shrink-0 rounded-md sm:h-5 sm:w-5"
              />

              {/* 모바일에서는 사이트 이름 대신 '무엇을 하는지'만 보여준다.
                  이미 이 사이트를 보고 있는 사람에게 사이트 이름은 정보가 아니다. */}
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-white sm:flex-none sm:text-xs">
                <span className="sm:hidden">홈 화면에 추가</span>
                <span className="hidden sm:inline">마스터스개혁파총회</span>
              </span>

              <button
                type="button"
                onClick={handleInstall}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-sky-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-sky-500 sm:gap-0.5 sm:px-2.5 sm:py-1 sm:text-xs"
              >
                <Download size={14} strokeWidth={2.5} className="sm:h-3 sm:w-3" />
                설치
              </button>

              <span className="hidden h-4 w-px shrink-0 bg-slate-700 sm:block" aria-hidden="true" />

              <button
                type="button"
                onClick={handleDismiss}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-white sm:h-6 sm:w-6"
                aria-label="설치 안내 닫기"
              >
                <X size={18} className="sm:h-3.5 sm:w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
