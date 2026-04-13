import clsx from 'clsx'

interface RightArrowIconProps {
  className?: string
  size?: number
}

export default function RightArrowIcon({
  className,
  size = 20,
}: RightArrowIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      className={clsx(className)}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.02693 4.52693C7.28809 4.26576 7.71152 4.26576 7.97268 4.52693L12.9727 9.52693C13.2338 9.78809 13.2338 10.2115 12.9727 10.4727L7.97268 15.4727C7.71152 15.7338 7.28809 15.7338 7.02693 15.4727C6.76576 15.2115 6.76576 14.7881 7.02693 14.5269L11.554 9.9998L7.02693 5.47268C6.76576 5.21152 6.76576 4.78809 7.02693 4.52693Z"
        fill="currentColor"
      />
    </svg>
  )
}
