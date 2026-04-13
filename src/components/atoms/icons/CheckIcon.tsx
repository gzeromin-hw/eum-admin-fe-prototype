export default function CheckIcon({
  className,
  strokeWidth = '0.4',
}: {
  className?: string
  strokeWidth?: string
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="11"
      viewBox="0 0 12 11"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.1037 2.76042C10.3006 2.96949 10.2907 3.29858 10.0817 3.49548L4.79022 8.47878C4.68872 8.57437 4.55308 8.6252 4.41376 8.61985C4.27443 8.6145 4.14309 8.55342 4.04922 8.45033L1.93239 6.12552C1.73904 5.91317 1.75443 5.58429 1.96678 5.39093C2.17913 5.19758 2.50802 5.21298 2.70137 5.42533L4.46217 7.35913L9.36864 2.73837C9.5777 2.54148 9.9068 2.55135 10.1037 2.76042Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
      />
    </svg>
  )
}
