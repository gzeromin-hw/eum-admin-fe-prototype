import clsx from 'clsx'

interface LeftArrowIconProps {
  className?: string
  size?: number
}

export default function LeftArrowIcon({
  className,
  size = 20,
}: LeftArrowIconProps) {
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
        d="M13.0015 4.52717C13.2627 4.78833 13.2627 5.21176 13.0015 5.47293L8.47437 10L13.0015 14.5272C13.2627 14.7883 13.2627 15.2118 13.0015 15.4729C12.7403 15.7341 12.3169 15.7341 12.0557 15.4729L7.05574 10.4729C6.79457 10.2118 6.79457 9.78833 7.05574 9.52717L12.0557 4.52717C12.3169 4.26601 12.7403 4.26601 13.0015 4.52717Z"
        fill="currentColor"
      />
    </svg>
  )
}
