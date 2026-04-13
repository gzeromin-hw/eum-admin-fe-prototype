interface SortIconProps {
  onClick?: () => void
}

export default function SortIcon({ onClick }: SortIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="15"
      viewBox="0 0 14 15"
      fill="none"
      onClick={onClick}
      className="cursor-pointer"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.45612 12.1807C7.2226 12.4727 6.77863 12.4727 6.54511 12.1807L4.2588 9.32287C3.95325 8.94092 4.22518 8.37513 4.71431 8.37513H9.28692C9.77604 8.37513 10.048 8.94092 9.74242 9.32287L7.45612 12.1807Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.54511 2.81951C6.77863 2.52761 7.2226 2.52761 7.45612 2.81951L9.74242 5.67739C10.048 6.05934 9.77604 6.62513 9.28692 6.62513H4.71431C4.22518 6.62513 3.95325 6.05934 4.25881 5.67739L6.54511 2.81951Z"
        fill="currentColor"
      />
    </svg>
  )
}
