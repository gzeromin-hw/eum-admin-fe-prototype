'use client'

import { useEffect, useState } from 'react'
import BaseCheckbox from './BaseCheckbox'

const MOCKUP_MODE_COOKIE_NAME = 'mockup-mode'

function getMockupModeFromCookie(): boolean {
  if (typeof window === 'undefined') return false
  const cookies = document.cookie.split('; ')
  const mockupCookie = cookies.find(row =>
    row.startsWith(`${MOCKUP_MODE_COOKIE_NAME}=`),
  )
  return mockupCookie?.split('=')[1] === 'true'
}

function setMockupModeCookie(enabled: boolean): void {
  if (typeof window === 'undefined') return
  document.cookie = `${MOCKUP_MODE_COOKIE_NAME}=${enabled}; path=/; max-age=31536000`
}

export function MockupToggle() {
  const [mounted, setMounted] = useState(false)
  const [isMockupMode, setIsMockupMode] = useState(false)

  // useEffect는 클라이언트 사이드에서만 실행됩니다
  useEffect(() => {
    setMounted(true)
    setIsMockupMode(getMockupModeFromCookie())
  }, [])

  if (!mounted) {
    return null
  }

  const handleChange = (checked: boolean) => {
    setIsMockupMode(checked)
    setMockupModeCookie(checked)
  }

  return (
    <BaseCheckbox
      id="mockup-toggle"
      checked={isMockupMode}
      onChange={handleChange}
      label="목업"
      color="gray"
      className="h-8 px-2"
    />
  )
}
