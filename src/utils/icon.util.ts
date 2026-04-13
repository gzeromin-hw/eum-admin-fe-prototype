export type StatusIconType = 'error' | 'success' | 'warning'

export function getStatusIconPath(
  type: StatusIconType,
  theme?: string,
): string {
  const isDark = theme === 'dark'
  const themeSuffix = isDark ? 'dark' : 'light'
  const prefix = process.env.NEXT_PUBLIC_PREFIX || ''

  switch (type) {
    case 'error':
      return `${prefix}/icons/alert/error-${themeSuffix}.png`
    case 'success':
      return `${prefix}/icons/alert/success-${themeSuffix}.png`
    case 'warning':
      return `${prefix}/icons/alert/warning-${themeSuffix}.png`
    default:
      return `${prefix}/icons/alert/error-${themeSuffix}.png`
  }
}

export function getFileIcon(fileNameOrExtension: string): string {
  const prefix = process.env.NEXT_PUBLIC_PREFIX || ''

  // 파일명에서 확장자 추출 (확장자만 넘어올 수도 있음)
  const extension = fileNameOrExtension.includes('.')
    ? fileNameOrExtension.split('.').pop()?.toLowerCase()
    : fileNameOrExtension.toLowerCase()

  switch (extension) {
    case 'pdf':
      return `${prefix}/images/file/pdf.png`
    case 'doc':
    case 'docx':
      return `${prefix}/images/file/word.png`
    case 'xls':
    case 'xlsx':
      return `${prefix}/images/file/excel.png`
    case 'ppt':
    case 'pptx':
      return `${prefix}/images/file/ppt.png`
    case 'hwp':
      return `${prefix}/images/file/hwp.png`
    case 'txt':
      return `${prefix}/images/file/txt.png`
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
    case 'svg':
      return `${prefix}/images/file/image.png`
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return `${prefix}/images/file/folder.png`
    default:
      return `${prefix}/images/file/default.png`
  }
}
