interface DownArrowIconProps {
  className?: string
}

export default function DownArrowIcon({ className }: DownArrowIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.52717 7.02713C4.78833 6.76597 5.21176 6.76597 5.47293 7.02713L10 11.5543L14.5272 7.02713C14.7883 6.76597 15.2118 6.76597 15.4729 7.02713C15.7341 7.2883 15.7341 7.71173 15.4729 7.97289L10.4729 12.9729C10.2118 13.2341 9.78833 13.2341 9.52717 12.9729L4.52717 7.97289C4.26601 7.71173 4.26601 7.2883 4.52717 7.02713Z"
        fill="currentColor"
      />
    </svg>
  )
}
