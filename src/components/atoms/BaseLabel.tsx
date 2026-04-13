'use client'

import React from 'react'
import clsx from 'clsx'

interface BaseLabelProps {
  label: string
  required?: boolean
  error?: boolean
  className?: string
  htmlFor?: string
}

export default function BaseLabel({
  label,
  required = false,
  error = false,
  className,
  htmlFor,
}: BaseLabelProps) {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx(
        'text-neutral px-1 text-sm leading-[140%] font-medium',
        'whitespace-nowrap',
        error && 'text-error',
        className,
      )}
    >
      {label}
      {required && <span className="text-error ml-1">*</span>}
    </label>
  )
}
