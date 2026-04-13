'use client'

import React from 'react'
import clsx from 'clsx'

interface BaseErrorMessageProps {
  error?: string
  className?: string
}

const BaseErrorMessage: React.FC<BaseErrorMessageProps> = ({
  error,
  className,
}) => {
  if (!error) return null

  return (
    <div
      className={clsx(
        'text-error px-1 text-left text-xs leading-[140%] font-medium',
        className,
      )}
    >
      {error}
    </div>
  )
}

export default BaseErrorMessage
