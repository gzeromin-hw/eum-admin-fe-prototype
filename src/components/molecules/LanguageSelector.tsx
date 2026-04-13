'use client'

import { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import { Locale, routing } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { useParams, useSearchParams } from 'next/navigation'

export function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLocale, setSelectedLocale] = useState<Locale>(
    routing.defaultLocale,
  )
  const dropdownRef = useRef<HTMLDivElement>(null)

  const $t = useTranslations('Locale')
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const searchParams = useSearchParams()

  // 컴포넌트 마운트 시와 pathname 변경 시 현재 locale 설정
  useEffect(() => {
    const currentLocale = params.locale as Locale
    if (currentLocale) {
      setSelectedLocale(currentLocale)
    }
  }, [params, $t])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // routing.locales 타입 문제 수정: string으로 타입 지정
  const handleLanguageSelect = (locale: Locale) => {
    // 현재 쿼리 파라미터를 유지하면서 언어만 변경
    const currentQuery = searchParams.toString()
    const newUrl = currentQuery ? `${pathname}?${currentQuery}` : pathname
    router.push(newUrl, { locale })
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={clsx(
          'text-normal hover:text-primary-normal flex h-8 min-w-16 items-center justify-between gap-1.5 px-2 text-sm transition-colors',
        )}
        aria-label="언어 선택"
      >
        <span className="font-medium whitespace-nowrap">
          {$t(selectedLocale)}
        </span>

        <svg
          className={clsx(
            'h-3.5 w-3.5 transition-transform duration-200',
            'text-icon-normal',
            isOpen ? 'rotate-180' : 'rotate-0',
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* 드롭다운 메뉴 */}
      {isOpen && (
        <div
          className={clsx(
            'border-line-alternative bg-background-normal absolute top-full right-0 z-40 mt-1.5 w-28 overflow-hidden border',
            'rounded-none shadow-[0_8px_20px_rgba(0,0,0,0.08)]',
          )}
        >
          {routing.locales.map(locale => (
            <button
              key={`LanguageSelector-${locale}`}
              onClick={() => handleLanguageSelect(locale)}
              className={clsx(
                'text-normal hover:bg-background-alternative flex h-9 w-full items-center px-3 text-left text-sm transition-colors duration-150',
                'rounded-none',
              )}
            >
              <span
                className={clsx(
                  'block w-full overflow-hidden text-ellipsis whitespace-nowrap',
                  locale === selectedLocale
                    ? 'text-primary-normal font-medium'
                    : 'font-normal',
                )}
              >
                {$t(locale)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
