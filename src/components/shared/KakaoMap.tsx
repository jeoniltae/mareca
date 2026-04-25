'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void
        LatLng: new (lat: number, lng: number) => object
        Map: new (container: HTMLElement, options: object) => object
        Marker: new (options: object) => { setMap: (map: object) => void }
        CustomOverlay: new (options: object) => { setMap: (map: object) => void }
        services: {
          Geocoder: new () => {
            addressSearch: (
              address: string,
              callback: (result: { x: string; y: string }[], status: string) => void
            ) => void
          }
          Status: { OK: string }
        }
      }
    }
  }
}

interface KakaoMapProps {
  address: string
  label: string
}

let scriptPromise: Promise<void> | null = null

function getKakaoMaps(): Promise<void> {
  if (scriptPromise) return scriptPromise

  scriptPromise = new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false&libraries=services`
    script.onload = () => {
      window.kakao.maps.load(() => resolve())
    }
    script.onerror = (e) => console.error('[KakaoMap] script load error:', e)
    document.head.appendChild(script)
  })

  return scriptPromise
}

export function KakaoMap({ address, label }: KakaoMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getKakaoMaps().then(() => {
      if (!containerRef.current) return
      const geocoder = new window.kakao.maps.services.Geocoder()
      geocoder.addressSearch(address, (result, status) => {
        if (status !== window.kakao.maps.services.Status.OK || !containerRef.current) return
        const coords = new window.kakao.maps.LatLng(Number(result[0].y), Number(result[0].x))
        const map = new window.kakao.maps.Map(containerRef.current, { center: coords, level: 3 })
        new window.kakao.maps.Marker({ position: coords, map })
        const overlay = new window.kakao.maps.CustomOverlay({
          position: coords,
          content: `<div style="background:#fff;border:1px solid #ccc;border-radius:4px;padding:3px 8px;font-size:12px;font-weight:600;white-space:nowrap;transform:translateY(-260%)">${label}</div>`,
          yAnchor: 0,
        })
        overlay.setMap(map)
      })
    })
  }, [address, label])

  return <div ref={containerRef} className="w-full h-full" />
}
