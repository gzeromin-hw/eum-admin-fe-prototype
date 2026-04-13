'use client'

import useLoadingStore from '@/hooks/store/loading'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'

export default function LoadingScreen() {
  const { isLoading, loadingMessage: customMessage } = useLoadingStore()
  const $t = useTranslations('LoadingScreen')

  const loadingMessage = customMessage || $t('loadingMessage')

  if (!isLoading) return null

  return (
    <div
      className={clsx(
        'fixed inset-0 h-dvh',
        'flex flex-col items-center justify-center gap-4',
        'z-[8888]',
        'bg-black/50 backdrop-blur-[1px]',
      )}
    >
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/30 border-t-white" />
      <div className="shimmer-text text-md h-[1.32rem] leading-[140%] font-bold text-white">
        {loadingMessage}
      </div>
    </div>
  )
}
