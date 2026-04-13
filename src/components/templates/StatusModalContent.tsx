'use client'

import React from 'react'
import clsx from 'clsx'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { getStatusIconPath, StatusIconType } from '@/utils/icon.util'
import BaseButton from '../molecules/BaseButton'

type StatusType = 'success' | 'warning' | 'error'
type DialogType = 'info' | 'confirm'

interface StatusModalContentProps {
  statusType?: StatusType
  title?: string
  message?: string
  dialogType?: DialogType
  onConfirm?: () => void
  onCancel?: () => void
  closeModal: () => void
  theme?: string
}

export default function StatusModalContent({
  statusType,
  title,
  message,
  dialogType,
  onConfirm,
  onCancel,
  closeModal,
  theme,
}: StatusModalContentProps) {
  const $t = useTranslations()
  return (
    <div className={clsx('flex w-full flex-col items-center gap-10')}>
      <div className={clsx('flex w-full flex-col items-center gap-2')}>
        <div className={clsx('flex w-full flex-col items-center pt-4')}>
          <Image
            src={getStatusIconPath(
              (statusType ?? 'error') as StatusIconType,
              theme,
            )}
            alt={`${statusType} icon`}
            width={48}
            height={48}
            className={clsx('h-12 w-12')}
          />
          {(title || title === '') && (
            <div className={clsx('flex w-full flex-col items-center')}>
              <div className={clsx('h-6 w-full p-[5px]')} />
              <div
                className={clsx(
                  'flex w-full flex-row items-center justify-center px-2.5',
                )}
                style={{ margin: '-12px 0 0 0' }}
              >
                <div
                  data-id="status-modal-title"
                  className={clsx(
                    'text-normal text-center text-xl leading-[140%] font-semibold',
                  )}
                >
                  {title}
                </div>
              </div>
            </div>
          )}
        </div>
        {message && (
          <div
            data-id="status-modal-message"
            className={clsx(
              'text-alternative text-md leading-[150%] font-normal',
              'text-center whitespace-pre-line',
            )}
          >
            {message}
          </div>
        )}
      </div>

      {dialogType === 'confirm' ? (
        <div className={clsx('flex w-full items-center justify-stretch gap-2')}>
          <BaseButton
            dataId="status-modal-cancel-button"
            type="button"
            variant="gray"
            size="default"
            shadow={false}
            onClick={() => {
              onCancel?.()
              closeModal()
            }}
          >
            {$t('Button.cancel')}
          </BaseButton>
          <BaseButton
            dataId="status-modal-confirm-button"
            type="button"
            variant="primary"
            size="default"
            shadow={false}
            onClick={() => {
              onConfirm?.()
              closeModal()
            }}
          >
            {$t('Button.confirm')}
          </BaseButton>
        </div>
      ) : (
        <BaseButton
          type="button"
          variant="primary"
          size="default"
          shadow={false}
          onClick={() => {
            onConfirm?.()
            closeModal()
          }}
        >
          {$t('Button.confirm')}
        </BaseButton>
      )}
    </div>
  )
}
