import React from 'react'
import type { Preview } from '@storybook/nextjs'
import '../src/app/globals.storybook.css'
import { ThemeProvider } from 'next-themes'
import { NoFlashWrapper } from '../src/components/templates/NoFlashWrapper'
import { NextIntlClientProvider } from 'next-intl'
import ko from '../messages/ko.json'

// Storybook Decorator 설정
export const decorators = [
  Story => (
    <NextIntlClientProvider locale="ko" messages={ko}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <NoFlashWrapper>
          <Story />
        </NoFlashWrapper>
      </ThemeProvider>
    </NextIntlClientProvider>
  ),
]

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // 이미지 로딩을 위한 추가 설정
    nextjs: {
      appDirectory: true,
    },
  },
}

export default preview
