interface DeleteIconProps {
  onClick?: (e: React.MouseEvent) => void
  className?: string
}

export default function DeleteIcon({ onClick, className }: DeleteIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className="text-common-0"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <circle cx="10.0001" cy="10" r="8.33333" className={className} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.64863 6.64858C6.90897 6.38822 7.33108 6.38822 7.59143 6.64856L13.3516 12.4086C13.6119 12.6689 13.6119 13.091 13.3516 13.3514C13.0912 13.6117 12.6691 13.6117 12.4088 13.3514L6.64864 7.59138C6.38828 7.33104 6.38828 6.90893 6.64863 6.64858Z"
        fill="white"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.3516 6.64858C13.6119 6.90893 13.6119 7.33104 13.3516 7.59138L7.59143 13.3514C7.33108 13.6117 6.90897 13.6117 6.64863 13.3514C6.38828 13.091 6.38828 12.6689 6.64864 12.4086L12.4088 6.64856C12.6691 6.38822 13.0912 6.38822 13.3516 6.64858Z"
        fill="white"
      />
    </svg>
  )
}
