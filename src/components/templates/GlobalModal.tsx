'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import clsx from 'clsx'
import useModalStore from '@/hooks/store/modal'
import CloseIcon from '../atoms/icons/CloseIcon'
import { useTheme } from 'next-themes'
import StatusModalContent from './StatusModalContent'

export default function GlobalModal() {
  const {
    isOpen,
    title,
    message,
    children,
    className,
    minWidth,
    maxWidth,
    padding,
    showCloseButton,
    statusType,
    dialogType,
    onConfirm,
    onCancel,
    closeModal,
  } = useModalStore()
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isStatusModal =
    statusType === 'success' ||
    statusType === 'warning' ||
    statusType === 'error'

  useEffect(() => {
    setMounted(true)
  }, [])

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && showCloseButton) {
        closeModal()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, showCloseButton, closeModal])

  // hydration 문제 방지를 위해 mounted 상태 확인
  if (!mounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          data-id="global-modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={clsx(
            'fixed inset-0 z-200 overflow-y-auto',
            'backdrop-blur-[1px]',
          )}
        >
          <div className="relative flex min-h-full items-center justify-center bg-[rgba(0,0,0,0.50)] py-8">
            <motion.div
              data-id="global-modal-container"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{
                duration: 0.3,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className={clsx(
                'relative flex flex-col items-start justify-start',
                'z-40 mx-8',
                !isStatusModal && 'w-full',
                'bg-modal-background-normal',
                className,
              )}
              style={
                isStatusModal
                  ? {
                      minWidth: '24.5rem',
                      maxWidth: '24.5rem',
                      padding: '1.5rem 1.25rem 1.75rem 1.25rem', // pt-6 pr-5 pb-7 pl-5
                    }
                  : {
                      minWidth: minWidth || undefined,
                      maxWidth: maxWidth || '32rem',
                      padding: padding || '2rem 2.5rem 2.75rem 2.5rem', // 기본값: pt-8 pr-10 pb-11 pl-10
                    }
              }
            >
              {showCloseButton && !isStatusModal && (
                <div
                  className={clsx(
                    'absolute top-10 right-10 whitespace-nowrap',
                    'h-5 w-5 cursor-pointer',
                    'flex items-center justify-center',
                    'text-modal-icon-normal hover:text-[#858588]',
                  )}
                  onClick={closeModal}
                >
                  <CloseIcon />
                </div>
              )}

              {isStatusModal ? (
                <StatusModalContent
                  statusType={statusType}
                  title={title}
                  message={message}
                  dialogType={dialogType}
                  onConfirm={onConfirm}
                  onCancel={onCancel}
                  closeModal={closeModal}
                  theme={theme}
                />
              ) : (
                <>
                  {title && (
                    <div
                      className={clsx(
                        'w-full pt-3',
                        'flex items-center justify-center',
                        'text-normal text-xl leading-[140%] font-semibold',
                      )}
                    >
                      {title}
                    </div>
                  )}
                  {children}
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
