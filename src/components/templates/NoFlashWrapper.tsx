'use client'

import { useEffect, useState } from 'react'

interface NoFlashWrapperProps {
  children: React.ReactNode
  className?: string
}

export function NoFlashWrapper({
  children,
  className = '',
}: NoFlashWrapperProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isThemeReady, setIsThemeReady] = useState(false)

  useEffect(() => {
    // FART/FOUC 방지: 초기 테마 상태 확인 및 설정
    const preventFlash = () => {
      const html = document.documentElement
      const savedTheme = localStorage.getItem('theme')
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)',
      ).matches

      // 저장된 테마가 있으면 적용, 없으면 시스템 설정 사용
      if (savedTheme) {
        html.setAttribute('data-theme', savedTheme)
        if (savedTheme === 'dark') {
          html.classList.add('dark')
        } else {
          html.classList.remove('dark')
        }
      } else if (systemPrefersDark) {
        html.setAttribute('data-theme', 'dark')
        html.classList.add('dark')
      } else {
        html.setAttribute('data-theme', 'light')
        html.classList.remove('dark')
      }

      // 테마가 준비되었는지 확인
      const checkThemeReady = () => {
        const hasThemeClass =
          html.classList.contains('dark') || html.classList.contains('light')
        const hasDataTheme = html.hasAttribute('data-theme')

        if ((hasThemeClass || html.classList.length === 0) && hasDataTheme) {
          setIsThemeReady(true)
          // 테마 준비 완료 후 즉시 표시
          setIsVisible(true)
        } else {
          // 테마 클래스가 아직 적용되지 않았다면 잠시 대기
          setTimeout(checkThemeReady, 5)
        }
      }

      checkThemeReady()
    }

    // 컴포넌트가 마운트된 후 즉시 실행
    preventFlash()

    // 최대 대기 시간 설정 (백업)
    const maxWaitTimer = setTimeout(() => {
      if (!isThemeReady) {
        setIsThemeReady(true)
        setIsVisible(true)
      }
    }, 100)

    return () => clearTimeout(maxWaitTimer)
  }, [isThemeReady])

  return (
    <div
      className={`${className} ${
        isVisible && isThemeReady ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transition: 'opacity 0.1s ease-in-out',
        // FART/FOUC 방지: 테마 전환 시 부드러운 애니메이션
        willChange: 'opacity',
        // 테마 전환 최적화
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
        // 초기 로딩 시 깜빡임 방지
        visibility: isVisible && isThemeReady ? 'visible' : 'hidden',
      }}
    >
      {children}
    </div>
  )
}
