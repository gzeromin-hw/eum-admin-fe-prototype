export default function MessageSquareDashedIcon({
  className,
}: {
  className?: string
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient
          id="gradient-message-square"
          x1="0"
          y1="12"
          x2="24"
          y2="12"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4393FC" stopOpacity="0.7" />
          <stop offset="15.87%" stopColor="#336AEF" stopOpacity="0.7" />
          <stop offset="48.27%" stopColor="#3B78FF" stopOpacity="0.7" />
          <stop offset="85.1%" stopColor="#B06DAB" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <g
        stroke="url(#gradient-message-square)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19h.01" />
        <path d="M12 3h.01" />
        <path d="M16 19h.01" />
        <path d="M16 3h.01" />
        <path d="M2 13h.01" />
        <path d="M2 17v4.286a.71.71 0 0 0 1.212.502l2.202-2.202A2 2 0 0 1 6.828 19H8" />
        <path d="M2 5a2 2 0 0 1 2-2" />
        <path d="M2 9h.01" />
        <path d="M20 3a2 2 0 0 1 2 2" />
        <path d="M22 13h.01" />
        <path d="M22 17a2 2 0 0 1-2 2" />
        <path d="M22 9h.01" />
        <path d="M8 3h.01" />
      </g>
    </svg>
  )
}
