import { useEffect, useRef } from 'react'
import clsx from 'clsx'

interface BaseCheckboxProps {
  id: string
  checked: boolean
  indeterminate?: boolean // ← 혼합 상태 추가
  onChange: (checked: boolean) => void
  label?: string
  className?: string
  color?: 'black' | 'gray'
}

export default function BaseCheckbox({
  id,
  checked,
  indeterminate = false,
  onChange,
  label,
  className,
  color = 'gray',
}: BaseCheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // 네이티브 혼합 상태 반영 (접근성/키보드 포커스에 유용)
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  // 일반 UX: 혼합 상태 클릭 시 checked=true로 전환(MUI 등과 동일한 동작)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (indeterminate) {
      // 부모에서 indeterminate=false로 바꿔주도록 설계(상태는 외부관리)
      onChange(true)
      return
    }
    onChange(e.target.checked)
  }

  const isOn = checked || indeterminate

  return (
    <div className={clsx('flex shrink-0 items-center gap-1', className)}>
      <div className="relative flex items-center">
        <input
          id={id}
          ref={inputRef}
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          aria-checked={indeterminate ? 'mixed' : checked}
          className={clsx(
            'border-line-alternative cursor-pointer border',
            'h-5 w-5 appearance-none rounded-[0.19rem]',
            // 혼합 상태일 때도 체크와 동일한 배경/테두리
            isOn &&
              (color === 'black'
                ? 'border-black bg-black'
                : 'border-gray-450 bg-gray-450'),
            'focus:outline-none',
          )}
        />
        {isOn && (
          <div
            className={clsx(
              'pointer-events-none absolute inset-0 flex items-center justify-center',
              color === 'black' && 'text-black',
              color === 'gray' && 'text-gray-450',
            )}
          >
            {checked ? (
              // ✓ 아이콘
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <rect
                  x="1"
                  y="1"
                  width="18"
                  height="18"
                  rx="3"
                  fill="currentColor"
                />
                <path
                  d="M8.89181 14.0255C8.55707 14.3603 8.01436 14.3603 7.67962 14.0255L4.60471 10.9506C4.27074 10.6166 4.27074 10.0752 4.60471 9.7412C4.93835 9.40756 5.47917 9.40718 5.81328 9.74036L7.67962 11.6015C8.0145 11.9354 8.55656 11.9351 8.89096 11.6007L14.1832 6.30843C14.5188 5.97286 15.0635 5.97416 15.3979 6.31092C15.7306 6.64599 15.7299 7.18739 15.396 7.52129L8.89181 14.0255Z"
                  fill="white"
                />
              </svg>
            ) : (
              // – 아이콘
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <rect
                  x="1"
                  y="1"
                  width="18"
                  height="18"
                  rx="3"
                  fill="currentColor"
                />
                <line
                  x1="5.875"
                  y1="10.125"
                  x2="14.125"
                  y2="10.125"
                  stroke="white"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </div>
        )}
      </div>

      {label && (
        <label
          htmlFor={id}
          className="text-normal cursor-pointer text-xs leading-[140%] font-normal"
        >
          {label}
        </label>
      )}
    </div>
  )
}
