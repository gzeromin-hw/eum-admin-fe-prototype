import { defineRouting } from 'next-intl/routing'

export type Locale = (typeof locales)[number]

const locales = ['ko', 'en'] as const
const defaultLocale: Locale = 'ko'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: 'always',
})
