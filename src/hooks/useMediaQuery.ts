import { useEffect, useState } from 'react'

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [matches, query])

  return matches
}

// Tailwind breakpoint에 맞는 미리 정의된 훅들
export function useBreakpoint() {
  const sm = useMediaQuery('(min-width: 640px)') // sm 이상
  const md = useMediaQuery('(min-width: 768px)') // md 이상
  const lg = useMediaQuery('(min-width: 1024px)') // lg 이상

  return {
    sm,
    md,
    lg,
  }
}

// 브라우저 높이에 따른 반응형 높이 관리 훅
export function useResponsiveHeight() {
  // 브라우저 높이에 따른 반응형 마진을 위한 미디어 쿼리
  const isShortHeight = useMediaQuery(
    '(min-height: 836px) and (max-height: 926px)',
  )
  const isMediumHeight = useMediaQuery(
    '(min-height: 927px) and (max-height: 1029px)',
  ) // 927px-1029px
  const isTallHeight = useMediaQuery('(min-height: 1030px)') // 1030px 이상
  const isVeryShortHeight = useMediaQuery(
    '(min-height: 731px) and (max-height: 835px)',
  ) // 731px-835px
  const isExtraShortHeight = useMediaQuery('(max-height: 730px)') // 730px 이하

  return {
    isShortHeight,
    isMediumHeight,
    isTallHeight,
    isVeryShortHeight,
    isExtraShortHeight,
  }
}
