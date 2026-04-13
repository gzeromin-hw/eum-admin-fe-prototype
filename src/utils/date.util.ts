import { useTranslations } from 'next-intl'

export type DateFormat =
  | 'YYYY-MM-DD'
  | 'YYYY-MM-DD HH:mm:ss'
  | 'RELATIVE'
  | 'MM/DD HH:mm'
  | 'YYYY.MM.dd'
export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]
export const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]

export const formatDate = (
  date: Date,
  format: DateFormat,
  $t?: ReturnType<typeof useTranslations>,
) => {
  const now = new Date()
  // 한국 시간으로 변경 KST = UTC+9
  const KST = new Date(date.getTime() + 9 * 60 * 60 * 1000)
  const year = KST.getFullYear()
  const month = String(KST.getMonth() + 1).padStart(2, '0')
  const day = String(KST.getDate()).padStart(2, '0')
  const hours = String(KST.getHours()).padStart(2, '0')
  const minutes = String(KST.getMinutes()).padStart(2, '0')
  const seconds = String(KST.getSeconds()).padStart(2, '0')
  const oneDayMs = 24 * 60 * 60 * 1000
  const diffDays = Math.floor(
    (new Date(now.toDateString()).getTime() -
      new Date(KST.toDateString()).getTime()) /
      oneDayMs,
  )
  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`
    case 'YYYY-MM-DD HH:mm:ss':
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
    case 'YYYY.MM.dd':
      return `${year}.${month}.${day}`
    case 'RELATIVE':
      if (diffDays === 0) return $t ? $t('format.date.today') : '오늘'
      if (diffDays === 1) return $t ? $t('format.date.yesterday') : '어제'
      if (diffDays === 2)
        return $t ? $t('format.date.theDayBeforeYesterday') : '엊그제'
      return `${year}.${month}.${day}`
    case 'MM/DD HH:mm':
      return `${month}/${day} ${hours}:${minutes}`
    default:
      return `${year}-${month}-${day}`
  }
}
