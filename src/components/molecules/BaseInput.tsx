'use client'

import React, { forwardRef, useState } from 'react'
import clsx from 'clsx'
import BaseLabel from '../atoms/BaseLabel'
import BaseErrorMessage from '../atoms/BaseErrorMessage'
import EyeIcon from '../atoms/icons/EyeIcon'
import EyeOffIcon from '../atoms/icons/EyeOffIcon'

interface BaseInputProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  type?: 'text' | 'email' | 'password'
  disabled?: boolean
  className?: string
  onFocus?: () => void
  onBlur?: () => void
  name?: string
  required?: boolean
  error?: string
  onClearError?: () => void
  id?: string
  maxLength?: number
  showCharCounter?: boolean
  showPasswordToggle?: boolean
}

const BaseInput = forwardRef<HTMLInputElement, BaseInputProps>(
  (
    {
      label,
      placeholder = '텍스트를 입력해주세요.',
      value = '',
      onChange,
      onKeyDown,
      type = 'text',
      disabled = false,
      className,
      onFocus,
      onBlur,
      name,
      required,
      error,
      onClearError,
      id,
      maxLength,
      showCharCounter = false,
      showPasswordToggle = false,
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        const newValue = e.target.value
        // maxLength가 설정되어 있으면 제한
        if (maxLength && newValue.length > maxLength) {
          return
        }
        onChange(newValue)
        onClearError?.()
      }
    }

    const inputId =
      id ||
      (label ? `input-${label.replace(/\s+/g, '-').toLowerCase()}` : undefined)

    return (
      <div className="flex w-full flex-col gap-2">
        {/* Label */}
        {label && (
          <BaseLabel
            label={label}
            required={required}
            error={!!error}
            htmlFor={inputId}
          />
        )}

        {/* Input Container */}
        <div className={clsx('flex flex-col gap-0.5')}>
          <div className="relative">
            <input
              ref={ref}
              id={inputId}
              type={
                type === 'password' && showPasswordToggle && showPassword
                  ? 'text'
                  : type
              }
              value={value}
              onChange={handleChange}
              onKeyDown={onKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              onFocus={onFocus}
              onBlur={onBlur}
              name={name}
              required={required}
              maxLength={maxLength}
              className={clsx(
                'flex-1 outline-none', // 기본 스타일 + 모바일 줌 방지
                'placeholder:text-assistive', // placeholder 색상
                'text-normal text-md leading-[140%] font-normal',
                'h-10 w-full border-[0.09rem] p-3',
                // 에러 상태일 때 빨간색 테두리, 그 외에는 기본 회색
                error
                  ? 'border-error focus-within:border-error'
                  : 'border-line-alternative focus-within:border-primary-normal',
                'focus:border-[0.09375rem]',
                disabled && 'cursor-not-allowed',
                disabled
                  ? 'bg-gray-50 dark:bg-gray-500'
                  : 'bg-modal-background-alternative',
                // 글자수 카운터가 있을 때 오른쪽 패딩 추가
                showCharCounter && maxLength && 'pr-16',
                // 비밀번호 토글 버튼이 있을 때 오른쪽 패딩 추가
                type === 'password' && showPasswordToggle && 'pr-10',
                className,
              )}
            />

            {/* 비밀번호 표시/숨김 토글 버튼 */}
            {type === 'password' && showPasswordToggle && (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(prev => !prev)}
                className={clsx(
                  'absolute top-1/2 right-3 -translate-y-1/2',
                  'text-assistive hover:text-normal',
                  'focus:outline-none',
                )}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            )}

            {/* 글자수 카운터 - input 안의 오른쪽 끝 */}
            {showCharCounter && maxLength && (
              <div
                className={clsx(
                  'absolute top-1/2 right-3 -translate-y-1/2',
                  'text-assistive text-xs leading-[140%] font-normal',
                  'pointer-events-none',
                )}
              >
                <span className="text-blue-400">{value.length}</span>
                <span>/{maxLength}</span>
              </div>
            )}
          </div>

          {/* Error Message */}
          <BaseErrorMessage error={error} />
        </div>
      </div>
    )
  },
)

BaseInput.displayName = 'BaseInput'

export default BaseInput
