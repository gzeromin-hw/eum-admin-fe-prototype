'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import DownArrowIcon from '../atoms/icons/DownArrowIcon'
import BaseLabel from '../atoms/BaseLabel'
import BaseErrorMessage from '../atoms/BaseErrorMessage'

export interface DropdownOption {
  value: string
  label: string
  disabled?: boolean
}

interface DropdownProps {
  options: DropdownOption[]
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  label?: string
  disabled?: boolean
  className?: string
  dropdownClassName?: string
  optionBoxClassName?: string
  optionClassName?: string
  error?: string
  required?: boolean
}

// 상수 정의
const DROPDOWN_MAX_HEIGHT = 'max-h-45'
const OPTION_HEIGHT = 'h-10'

export default function BaseDropdown({
  options = [],
  value = '',
  onChange,
  placeholder,
  label,
  disabled = false,
  className,
  dropdownClassName,
  optionBoxClassName,
  optionClassName,
  error,
  required = false,
}: DropdownProps) {
  const $t = useTranslations('Common')
  const [isOpen, setIsOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedOption = options.find(option => option.value === value)

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 드롭다운이 열릴 때 포커스 인덱스 초기화
  useEffect(() => {
    if (isOpen) {
      const currentIndex = options.findIndex(option => option.value === value)
      setFocusedIndex(currentIndex >= 0 ? currentIndex : 0)
    } else {
      setFocusedIndex(-1)
    }
  }, [isOpen, value, options])

  const handleSelect = useCallback(
    (optionValue: string) => {
      if (disabled) return

      onChange?.(optionValue)
      setIsOpen(false)
      setFocusedIndex(-1)
    },
    [disabled, onChange],
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (disabled) return

      const { key } = event
      const isDropdownOpen = isOpen && focusedIndex >= 0

      switch (key) {
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (isDropdownOpen && options.length > 0) {
            const focusedOption = options[focusedIndex]
            if (!focusedOption.disabled) {
              handleSelect(focusedOption.value)
            }
          } else {
            setIsOpen(prev => !prev)
          }
          break
        case 'Escape':
          setIsOpen(false)
          setFocusedIndex(-1)
          break
        case 'ArrowDown':
          event.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
          } else if (options.length > 0) {
            setFocusedIndex(prev => (prev + 1) % options.length)
          }
          break
        case 'ArrowUp':
          event.preventDefault()
          if (!isOpen) {
            setIsOpen(true)
          } else if (options.length > 0) {
            setFocusedIndex(prev => (prev <= 0 ? options.length - 1 : prev - 1))
          }
          break
      }
    },
    [disabled, isOpen, focusedIndex, options, handleSelect],
  )

  return (
    <div className={clsx('relative', className)} ref={dropdownRef}>
      {/* label */}
      {label && (
        <div className="mb-2 shrink-0">
          <BaseLabel label={label} required={required} error={!!error} />
        </div>
      )}

      {/* dropdown */}
      <div
        className={clsx(
          OPTION_HEIGHT,
          'rounded-none border px-3',
          'bg-modal-background-alternative border-modal-line-alternative',
          'flex shrink-0 items-center justify-between gap-3 self-stretch',
          'text-xs focus:outline-none',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'hover:border-primary hover:cursor-pointer',
          error
            ? 'border-error focus-within:border-error'
            : 'focus-within:border-primary-normal',
          'focus:border-[0.09375rem]',
          label && 'mt-2',
          dropdownClassName,
        )}
        onClick={() => !disabled && setIsOpen(prev => !prev)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? 'dropdown-listbox' : undefined}
        aria-label={label}
        aria-required={required}
        aria-invalid={!!error}
      >
        <div className="text-normal text-md truncate text-left leading-[140%] font-normal">
          {selectedOption?.label || placeholder || $t('selectPlaceholder')}
        </div>
        <div
          className={clsx(
            'h-5 w-5 transition-transform duration-200',
            isOpen ? 'rotate-180' : 'rotate-0',
          )}
        >
          <DownArrowIcon />
        </div>
      </div>

      {/* error message */}
      <BaseErrorMessage error={error} className="mt-1" />

      {/* dropdown content */}
      {isOpen && !disabled && (
        <div
          className={clsx(
            'absolute top-full right-0 left-0 z-10 mt-1.5',
            optionBoxClassName,
          )}
          role="listbox"
          id="dropdown-listbox"
        >
          <div
            className={clsx(
              DROPDOWN_MAX_HEIGHT,
              'overflow-y-auto rounded-none px-1.5 pt-1.5 pb-2',
              'bg-background-neutral',
              'border-line-neutral border',
              '[box-shadow:0_2px_2px_0_rgba(0,0,0,0.02),2px_6px_12px_2px_rgba(0,0,0,0.04)]',
            )}
          >
            {options.length > 0 ? (
              options.map((option, index) => {
                const isSelected = value === option.value
                const isFocused = focusedIndex === index
                const isDisabled = option.disabled

                return (
                  <button
                    key={`dropdown-${option.value}-${index}`}
                    type="button"
                    onClick={() => !isDisabled && handleSelect(option.value)}
                    onMouseEnter={() => setFocusedIndex(-1)}
                    disabled={isDisabled}
                    className={clsx(
                      'text-md',
                      OPTION_HEIGHT,
                      'w-full px-4 py-1 text-left leading-[140%]',
                      'rounded-none hover:transition-colors hover:duration-150',
                      'hover:bg-context-background-alternative focus:bg-context-background-alternative focus:outline-none',
                      isDisabled
                        ? 'cursor-not-allowed opacity-50'
                        : 'cursor-pointer',
                      // 키보드 포커스 효과
                      isFocused && 'bg-context-background-alternative',
                      // 선택된 값의 텍스트 색상
                      isSelected && 'text-primary-normal',
                      // 선택된 값의 배경색 (포커스가 없을 때만)
                      isSelected &&
                        !isFocused &&
                        'bg-modal-background-alternative',
                      // 기본 텍스트 색상
                      !isSelected && 'text-neutral',
                      optionClassName,
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {option.label}
                  </button>
                )
              })
            ) : (
              <div
                className={clsx(
                  OPTION_HEIGHT,
                  'w-full cursor-default px-4 py-2 opacity-50',
                  'text-neutral text-md flex items-center leading-[140%]',
                )}
              >
                {$t('noOptionsAvailable')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
