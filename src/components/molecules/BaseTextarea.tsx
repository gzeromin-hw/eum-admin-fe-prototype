'use client'

import React, { useRef, useCallback, useEffect } from 'react'
import clsx from 'clsx'
import BaseLabel from '../atoms/BaseLabel'
import BaseErrorMessage from '../atoms/BaseErrorMessage'

interface BaseTextareaProps {
  label?: string
  placeholder?: string
  value?: string
  onChange: (value: string) => void
  error?: string
  onClearError?: () => void
  required?: boolean
  maxLength?: number
  showCharCounter?: boolean
  className?: string
  style?: React.CSSProperties
  minHeight?: number
  maxHeight?: number
  rows?: number
  disabled?: boolean
}

const BaseTextarea: React.FC<BaseTextareaProps> = ({
  label,
  placeholder,
  value = '',
  onChange,
  error,
  onClearError,
  required = false,
  maxLength,
  showCharCounter = false,
  className,
  style,
  minHeight = 44,
  maxHeight = 88,
  rows = 1,
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  // textarea 높이 자동 조정 함수
  const adjustTextareaHeight = useCallback(() => {
    if (textareaRef.current) {
      // 스타일을 임시로 리셋
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.overflow = 'hidden'

      // scrollHeight로 조정
      const newHeight = textareaRef.current.scrollHeight
      const finalHeight = Math.max(newHeight, minHeight)

      // 최대 높이 초과 시 스크롤 허용
      if (finalHeight > maxHeight) {
        textareaRef.current.style.height = `${maxHeight}px`
        textareaRef.current.style.overflow = 'auto'
      } else {
        textareaRef.current.style.height = `${finalHeight}px`
      }
    }
  }, [minHeight, maxHeight])

  // value가 변경될 때마다 높이 조정
  useEffect(() => {
    adjustTextareaHeight()
  }, [value, adjustTextareaHeight])

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    onClearError?.()

    // 높이 조정을 즉시 실행
    requestAnimationFrame(() => {
      adjustTextareaHeight()
    })
  }

  return (
    <div className={clsx('flex w-full flex-col gap-2', className)}>
      {label && <BaseLabel label={label} required={required} error={!!error} />}
      <div className="flex flex-col gap-0.5">
        <textarea
          ref={textareaRef}
          className={clsx(
            'mt-2 outline-none',
            'placeholder:text-assistive',
            'text-normal text-md leading-[140%] font-normal',
            'w-full border-[0.09rem] p-3',
            error
              ? 'border-error focus-within:border-error'
              : 'border-line-alternative focus-within:border-primary-normal',
            'focus-within:border-[0.09rem]',
            'bg-modal-background-alternative',
            'resize-y',
            'overflow-hidden', // 기본적으로 스크롤 숨김
            disabled && 'cursor-not-allowed opacity-50',
          )}
          style={{
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`,
            ...style,
          }}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          rows={rows}
          maxLength={maxLength}
          disabled={disabled}
        />
        {/* 글자수 카운터 및 에러 메시지 */}
        <div className="mt-1 flex flex-row-reverse justify-between">
          {showCharCounter && maxLength && (
            <div
              className={clsx(
                'flex justify-end px-1',
                'text-assistive text-xs leading-[140%] font-normal',
              )}
            >
              <span className="text-blue-400">{value.length}</span>
              <span>/{maxLength}</span>
            </div>
          )}
          <BaseErrorMessage error={error} />
        </div>
      </div>
    </div>
  )
}

export default BaseTextarea
