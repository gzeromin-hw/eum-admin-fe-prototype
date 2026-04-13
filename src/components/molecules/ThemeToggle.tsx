'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import clsx from 'clsx'
import SunIcon from '../atoms/icons/SunIcon'
import MoonIcon from '../atoms/icons/MoonIcon'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  // useEffect는 클라이언트 사이드에서만 실행됩니다
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const handleThemeChange = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'

    // FART 방지: data-theme 속성 즉시 업데이트
    document.documentElement.setAttribute('data-theme', newTheme)

    // 테마 변경 실행
    setTheme(newTheme)

    // 로컬 스토리지와 쿠키에 저장
    localStorage.setItem('theme', newTheme)
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`
  }

  return (
    <button
      className={clsx(
        'text-icon-normal hover:bg-background-alternative hover:text-primary-normal',
        'flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center transition-colors',
        'rounded-none',
      )}
      aria-label="테마 토글"
      title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
      onClick={handleThemeChange}
    >
      {theme === 'light' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
