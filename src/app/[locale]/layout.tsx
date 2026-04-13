import type { Metadata } from 'next'
import '../globals.css'
import { ThemeProvider } from 'next-themes'
import { hasLocale } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { NoFlashWrapper } from '@/components/templates/NoFlashWrapper'
import ReactToastify from '@/components/molecules/ReactToastify'
import ReactQueryProvider from './_react_query_provider'
import GlobalModal from '@/components/templates/GlobalModal'
import LoadingScreen from '@/components/templates/LoadingScreen'
import { ThemeInitScript } from '@/components/templates/ThemeInitScript'
import { cookies } from 'next/headers'
import clsx from 'clsx'
import LocaleProvider from './_locale_provider'
import { MockupToggle } from '@/components/molecules/MockupToggle'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    return {
      title: '404 Not Found',
    }
  }

  return {
    title: 'EUM Admin',
  }
}

async function getInitialTheme(): Promise<'light' | 'dark'> {
  try {
    const cookieStore = await cookies()
    const themeCookie = cookieStore.get('theme')
    if (themeCookie?.value === 'dark' || themeCookie?.value === 'light') {
      return themeCookie.value as 'light' | 'dark'
    }
  } catch {
    // cookies()가 실패하면 기본값 사용
  }
  return 'light'
}

export default async function RootLayout({
  params,
  children,
}: Readonly<{
  params: Promise<{ locale: string }>
  children: React.ReactNode
}>) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  const initialTheme = await getInitialTheme()
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      className={initialTheme === 'dark' ? 'dark' : ''}
      suppressHydrationWarning
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
        />
      </head>
      <body className={clsx('antialiased')} suppressHydrationWarning>
        <ThemeInitScript initialTheme={initialTheme} />
        <ThemeProvider
          attribute="class"
          defaultTheme={initialTheme}
          enableSystem={false}
          disableTransitionOnChange={false}
          storageKey="theme"
          themes={['light', 'dark']}
        >
          <LocaleProvider
            locale={locale}
            messages={messages}
            timeZone="Asia/Seoul"
          >
            <ReactQueryProvider>
              <NoFlashWrapper>
                {children}
                <ReactToastify />
                <GlobalModal />
                <LoadingScreen />
              </NoFlashWrapper>
            </ReactQueryProvider>
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
