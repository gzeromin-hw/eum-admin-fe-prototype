import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware({
  ...routing,
  // 브라우저 언어 감지만 비활성화 (쿠키는 여전히 확인)
  localeDetection: false,
})

export default function proxy(request: NextRequest) {
  // 쿠키에서 NEXT_LOCALE 확인
  const localeCookie = request.cookies.get('NEXT_LOCALE')
  const cookieLocale = localeCookie?.value

  // URL에 로케일이 있는지 확인
  const pathname = request.nextUrl.pathname
  const pathnameHasLocale = routing.locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  )

  // URL에 로케일이 없는 경우
  if (!pathnameHasLocale) {
    let targetLocale: (typeof routing.locales)[number] = routing.defaultLocale

    // 쿠키에 유효한 로케일이 있으면 해당 로케일 사용, 없으면 기본 로케일 사용
    if (
      cookieLocale &&
      routing.locales.includes(cookieLocale as (typeof routing.locales)[number])
    ) {
      targetLocale = cookieLocale as (typeof routing.locales)[number]
    }

    const newUrl = request.nextUrl.clone()
    newUrl.pathname = `/${targetLocale}${pathname === '/' ? '' : pathname}`
    const response = NextResponse.redirect(newUrl)
    response.headers.set('x-request-url', request.url)
    return response
  }

  const response = intlMiddleware(request)

  // 요청 URL을 커스텀 헤더로 추가하여 generateMetadata에서 사용할 수 있도록 함
  const requestUrl = request.url
  if (response) {
    response.headers.set('x-request-url', requestUrl)
  }

  return response
}

export const config = {
  // Match all pathnames except for
  // - … if they start with `/api`, `/bff`, `/trpc`, `/_next` or `/_vercel`
  // - … the ones containing a dot (e.g. `favicon.ico`)
  matcher: ['/', '/((?!api|bff|trpc|_next|_vercel|.*\\..*).*)'],
}
