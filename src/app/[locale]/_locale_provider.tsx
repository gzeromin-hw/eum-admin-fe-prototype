'use client'
import { NextIntlClientProvider } from 'next-intl'
import { useEffect } from 'react'

export default function LocaleProvider({
  locale,
  messages,
  timeZone,
  children,
}: {
  locale: string
  messages: Record<string, unknown>
  timeZone: string
  children: React.ReactNode
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', locale)
    }
  }, [locale])

  return (
    <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
      {children}
    </NextIntlClientProvider>
  )
}
