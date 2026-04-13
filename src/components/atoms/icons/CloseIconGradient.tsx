export default function CloseIconGradient({
  className,
}: {
  className?: string
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      className={className}
    >
      <defs>
        <linearGradient
          id="gradient-close-icon"
          x1="0"
          y1="7"
          x2="14"
          y2="7"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#4393FC" stopOpacity="0.7" />
          <stop offset="15.87%" stopColor="#336AEF" stopOpacity="0.7" />
          <stop offset="48.27%" stopColor="#3B78FF" stopOpacity="0.7" />
          <stop offset="85.1%" stopColor="#B06DAB" stopOpacity="0.7" />
        </linearGradient>
      </defs>
      <path
        d="M12.4756 0.392639C12.788 0.0802197 13.295 0.0802197 13.6074 0.392639C13.9196 0.704961 13.9195 1.2111 13.6074 1.5235L8.13086 6.99908L13.6074 12.4756C13.9198 12.7881 13.9198 13.2951 13.6074 13.6075C13.295 13.9199 12.788 13.9199 12.4756 13.6075L6.99902 8.13092L1.52344 13.6075C1.21104 13.9195 0.7049 13.9197 0.392578 13.6075C0.0801587 13.2951 0.0801587 12.7881 0.392578 12.4756L5.86816 6.99908L0.392578 1.5235C0.0803541 1.21106 0.0802238 0.704993 0.392578 0.392639C0.704932 0.0802848 1.211 0.0804151 1.52344 0.392639L6.99902 5.86823L12.4756 0.392639Z"
        fill="url(#gradient-close-icon)"
      />
    </svg>
  )
}
