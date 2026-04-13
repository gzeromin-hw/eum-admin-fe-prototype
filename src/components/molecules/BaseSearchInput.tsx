import clsx from 'clsx'
import { useRef } from 'react'
import MagnifyingGlassIcon from '../atoms/icons/MagnifyingGlassIcon'
import DeleteIcon from '../atoms/icons/DeleteIcon'

interface BaseSearchInputProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  className?: string
  width?: string
  height?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  onCompositionStart?: () => void
  onCompositionEnd?: (e: React.CompositionEvent<HTMLInputElement>) => void
  autoFocus?: boolean
}

export default function BaseSearchInput({
  placeholder,
  value = '',
  onChange,
  className,
  width = '21.6rem',
  height = '2.5rem',
  onKeyDown,
  onCompositionStart,
  onCompositionEnd,
  autoFocus,
}: BaseSearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const onChangeWrapper = (value: string) => {
    onChange(value)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onChangeWrapper('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && value) {
      e.preventDefault()
      e.stopPropagation()
      onChangeWrapper('')
      return
    }
    onKeyDown?.(e)
  }

  return (
    <div
      className={clsx(
        'overflow-hidden px-4 py-1',
        'flex items-center justify-start gap-3',
        'bg-background-neutral text-assistive opacity-90 dark:opacity-100',
        'border-line-alternative border-[0.09rem] border-solid',
        'focus-within:border-primary-normal focus-within:border-[0.09375rem]',
        className,
      )}
      style={{ width, height }}
    >
      {/* 검색 아이콘 */}
      <div
        className={clsx(
          'flex items-center',
          'text-icon-normal h-5 w-5 shrink-0 p-[0.09rem]',
        )}
      >
        <MagnifyingGlassIcon />
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
        autoFocus={autoFocus}
        className={clsx(
          'border-none bg-transparent outline-none',
          'text-normal font-medium',
          'placeholder:text-assistive placeholder:font-normal',
          'flex-1',
        )}
        placeholder={placeholder}
      />
      {value && <DeleteIcon className="fill-gray-300" onClick={handleDelete} />}
    </div>
  )
}
