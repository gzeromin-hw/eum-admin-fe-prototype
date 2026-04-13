'use client'

import { useState } from 'react'
import { Link, useRouter } from '@/i18n/navigation'
import clsx from 'clsx'
import { PowerIcon } from 'lucide-react'
import { LanguageSelector } from '@/components/molecules/LanguageSelector'
import { ThemeToggle } from '@/components/molecules/ThemeToggle'
import useAuthStore from '@/hooks/store/auth'
import { MockupToggle } from '@/components/molecules/MockupToggle'

export default function Header() {
  const router = useRouter()
  const logout = useAuthStore(state => state.logout)
  const user = useAuthStore(state => state.user)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const displayName = user?.alias?.trim() || 'Unknown'

  const handleLogout = async () => {
    if (isLoggingOut) return

    setIsLoggingOut(true)
    try {
      await logout()
      router.replace('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <header
      className={clsx(
        'bg-background-normal border-line-normal flex h-(--header-height) w-full shrink-0 items-center border-b px-4 md:px-6',
      )}
    >
      <div className="flex items-center gap-2">
        <Link href="/" className="text-primary-normal text-xl font-bold tracking-tight">
          EUM
        </Link>
      </div>

      <div className="ml-auto flex min-w-0 items-center gap-1">
        {/* 개발/테스트 환경에서만 표시 */}
        {process.env.NODE_ENV !== 'production' && (
          <MockupToggle />
        )}
        <LanguageSelector />
        <ThemeToggle />

        {user && (
          <div className="border-line-alternative hidden min-w-0 items-center gap-3 border-l ml-3 pl-4 lg:flex">
            <div className="min-w-0">
              <p className="text-strong truncate text-sm leading-tight font-semibold">
                {displayName}
              </p>
              <p className="text-assistive truncate text-[11px] leading-tight">
                {user.user_id || '-'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              disabled={isLoggingOut}
              aria-label="로그아웃"
              title="로그아웃"
              className="text-icon-normal hover:text-primary-normal flex h-6 w-6 shrink-0 items-center justify-center transition-colors disabled:opacity-60"
            >
              <PowerIcon size={16} />
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
