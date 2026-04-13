'use client'

import React from 'react'
import clsx from 'clsx'

const getVariantStyles = (
  variant: 'primary' | 'gray' | 'white' | 'danger',
  size: 'default' | 'big' | 'small' | 'medium',
) => {
  switch (variant) {
    case 'primary':
      return 'bg-primary-normal text-common-0 hover:bg-primary-strong'
    case 'gray':
      return 'bg-modal-background-neutral dark:text-gray-250 hover:bg-gray-150 dark:hover:bg-gray-450 text-gray-300'
    case 'white':
      return (
        'bg-background-neutral text-gray-400 border ' +
        'hover:bg-gray-100 dark:hover:bg-gray-500 ' +
        (size === 'small' ? 'border-line-normal' : 'border-line-neutral')
      )
    case 'danger':
      return 'bg-danger text-common-0 hover:bg-danger-strong'
    default:
      return ''
  }
}

const getSizeStyles = (size: 'default' | 'big' | 'small' | 'medium') => {
  switch (size) {
    case 'small':
      return 'w-auto px-3 py-1 h-6 text-xs'
    case 'medium':
      return 'w-auto px-4 py-2 h-8 text-sm'
    case 'big':
      return 'w-full py-4.5 h-17 text-xl'
    case 'default':
    default:
      return 'w-full py-4.5 h-10 text-base'
  }
}

interface BaseButtonProps {
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
  className?: string
  size?: 'default' | 'big' | 'small' | 'medium'
  shadow?: boolean
  variant?: 'primary' | 'gray' | 'white' | 'danger'
  dataId?: string
}

function BaseButton({
  children,
  type = 'button',
  onClick,
  disabled = false,
  className,
  size = 'default',
  variant = 'primary',
  shadow = true,
  dataId,
}: BaseButtonProps) {
  return (
    <button
      data-id={dataId}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        getSizeStyles(size),
        'flex items-center justify-center',
        getVariantStyles(variant, size),
        'font-semibold',
        'focus:outline-none',
        'hover:transition-all hover:duration-200 hover:ease-in-out',
        !disabled && 'cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        shadow &&
          size !== 'small' &&
          'shadow-[0px_10px_24px_4px_rgba(15,23,42,0.14)]',
        className,
      )}
    >
      {children}
    </button>
  )
}

export default BaseButton
