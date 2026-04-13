import { useState, useRef, useEffect, useCallback } from 'react'
import clsx from 'clsx'
import { useTranslations } from 'next-intl'
import DownArrowIcon from '../atoms/icons/DownArrowIcon'
import { highlightText } from '../../utils/string.util'
import BaseSearchInput from './BaseSearchInput'

interface Option {
  value: string
  label: string
  description?: string
}

interface BaseAutoCompletionProps {
  options: Option[]
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
  searchable?: boolean
  error?: string
}

// 상수 정의
const DROPDOWN_MAX_HEIGHT = 'max-h-46'
const OPTION_HEIGHT = 'h-10'
const FOCUS_RESTORE_DELAY = 0

export default function BaseAutoCompletion({
  options,
  placeholder,
  value,
  onChange,
  className,
  disabled = false,
  searchable = true,
  error,
}: BaseAutoCompletionProps) {
  const $t = useTranslations('Common')
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const [isComposing, setIsComposing] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])

  // 현재 선택된 옵션의 라벨 찾기
  const selectedOption = options.find(option => option.value === value)

  // 검색어에 따라 필터링된 옵션들
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : options

  // 포커스 복원 헬퍼 함수
  const restoreFocus = useCallback(() => {
    setTimeout(() => {
      containerRef.current?.focus()
    }, FOCUS_RESTORE_DELAY)
  }, [])

  // 드롭다운 열기/닫기
  const toggleDropdown = useCallback(() => {
    if (disabled) return
    setIsOpen(!isOpen)
    if (!isOpen) {
      // 드롭다운이 열릴 때 현재 선택된 값으로 검색어 초기화
      setSearchTerm('')
      setFocusedIndex(-1)
    } else {
      restoreFocus()
    }
  }, [disabled, isOpen, restoreFocus])

  // 옵션 선택
  const selectOption = useCallback(
    (option: Option) => {
      onChange(option.value)
      setIsOpen(false)
      setSearchTerm('')
      setFocusedIndex(-1)
      restoreFocus()
    },
    [onChange, restoreFocus],
  )

  // IME 조합 시작/종료 핸들러
  const handleCompositionStart = useCallback(() => {
    setIsComposing(true)
  }, [])

  const handleCompositionEnd = useCallback(
    (e: React.CompositionEvent<HTMLInputElement>) => {
      setIsComposing(false)
      // 조합이 끝난 최종값을 상태에 반영
      setSearchTerm(e.currentTarget.value)
    },
    [],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return
      // IME 조합 중이면 버퍼가 input에 남지 않도록 엔터 처리 무시
      if (isComposing) {
        e.preventDefault()
        return
      }
      switch (e.key) {
        case 'Enter':
        case ' ':
          e.preventDefault()
          if (isOpen && filteredOptions.length > 0 && focusedIndex >= 0) {
            const focusedOption = filteredOptions[focusedIndex]
            selectOption(focusedOption)
          } else {
            toggleDropdown()
          }
          break
        case 'Escape':
          toggleDropdown()
          break
        case 'ArrowDown':
          e.preventDefault()
          if (!isOpen) {
            toggleDropdown()
          } else if (filteredOptions.length > 0) {
            const nextIndex = (focusedIndex + 1) % filteredOptions.length
            setFocusedIndex(nextIndex)
          }
          break
        case 'ArrowUp':
          e.preventDefault()
          if (!isOpen) {
            toggleDropdown()
          } else if (filteredOptions.length > 0) {
            const prevIndex =
              focusedIndex <= 0 ? filteredOptions.length - 1 : focusedIndex - 1
            setFocusedIndex(prevIndex)
          }
          break
      }
    },
    [
      disabled,
      isComposing,
      isOpen,
      filteredOptions,
      focusedIndex,
      selectOption,
      toggleDropdown,
    ],
  )

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setSearchTerm('')
        setFocusedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 드롭다운이 열릴 때 포커스 인덱스 초기화
  useEffect(() => {
    if (isOpen) {
      const currentIndex = filteredOptions.findIndex(
        option => option.value === value,
      )
      setFocusedIndex(currentIndex >= 0 ? currentIndex : 0)
    } else {
      setFocusedIndex(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, value]) // filteredOptions 의존성 제거 (검색 시 포커스 리셋 방지)

  // 필터링된 옵션이 변경될 때 refs 배열 초기화
  useEffect(() => {
    optionRefs.current = new Array(filteredOptions.length).fill(null)
  }, [filteredOptions.length])

  // 포커스된 옵션으로 스크롤
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionRefs.current[focusedIndex]) {
      optionRefs.current[focusedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }, [focusedIndex, isOpen])

  return (
    <div className={clsx('relative', className)}>
      {/* 입력 필드 */}
      <div
        ref={containerRef}
        className={clsx(
          OPTION_HEIGHT,
          'border px-3',
          'bg-modal-background-alternative border-modal-line-alternative',
          'flex shrink-0 items-center justify-between gap-3 self-stretch',
          'focus:outline-none',
          disabled
            ? 'cursor-not-allowed opacity-50'
            : 'hover:border-primary hover:cursor-pointer',
          error
            ? 'border-error focus-within:border-error'
            : 'focus-within:border-primary-normal',
          'focus:border-[0.09375rem]',
        )}
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={isOpen ? 'autocompletion-listbox' : undefined}
      >
        <div className="flex min-w-0 flex-1 items-center">
          {isOpen && searchable ? (
            <BaseSearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder={placeholder || $t('selectPlaceholder')}
              className="flex-1 gap-2! rounded-none! border-0! bg-transparent! p-0!"
              width="100%"
              height="100%"
              onKeyDown={handleKeyDown}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
              autoFocus
            />
          ) : (
            <div
              className={clsx(
                'flex items-center gap-2',
                'truncate text-left leading-[140%] font-normal',
              )}
            >
              {selectedOption?.description && (
                <div className="text-alternative text-xxs font-normal">
                  {selectedOption.description}
                </div>
              )}
              <div className="text-neutral text-md font-normal">
                {selectedOption?.label ||
                  placeholder ||
                  $t('selectPlaceholder')}
              </div>
            </div>
          )}
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

      {/* 드롭다운 옵션들 */}
      {isOpen && !disabled && (
        <div
          className="absolute top-full right-0 left-0 z-10 mt-1.5"
          role="listbox"
          id="autocompletion-listbox"
        >
          <div
            className={clsx(
              DROPDOWN_MAX_HEIGHT,
              'overflow-y-auto px-1.5 pt-1.5 pb-2',
              'bg-background-neutral',
              'border-line-neutral border',
              '[box-shadow:0_2px_2px_0_rgba(0,0,0,0.02),2px_6px_12px_2px_rgba(0,0,0,0.04)]',
            )}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => {
                const isSelected = value === option.value
                const isFocused = focusedIndex === index

                return (
                  <button
                    key={`autocompletion-${option.value}-${index}`}
                    ref={el => {
                      optionRefs.current[index] = el
                    }}
                    type="button"
                    onMouseDown={() => selectOption(option)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    className={clsx(
                      OPTION_HEIGHT,
                      'w-full px-4 py-2 text-left leading-[140%]',
                      'hover:transition-colors hover:duration-150',
                      'hover:bg-context-background-alternative focus:bg-context-background-alternative focus:outline-none',
                      'flex cursor-pointer items-center',
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
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div>
                      <div
                        className={clsx(
                          'text-md font-medium',
                          isSelected ? 'text-primary-normal' : 'text-neutral',
                        )}
                      >
                        {highlightText(option.label, searchTerm)}
                      </div>
                      {option.description && (
                        <div className="text-alternative text-xxs font-normal">
                          {highlightText(option.description, searchTerm)}
                        </div>
                      )}
                    </div>
                  </button>
                )
              })
            ) : (
              <div
                className={clsx(
                  OPTION_HEIGHT,
                  'w-full cursor-default px-4 py-1 opacity-50',
                  'text-neutral text-md flex items-center leading-[140%]',
                )}
              >
                {options.length === 0
                  ? $t('noOptionsAvailable')
                  : $t('noSearchResults')}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
