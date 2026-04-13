// 구분자 상수
export const SEPARATOR = ':' as const

// Neo4j 그래프 시각화 tool name
export const GRAPH_NEO4J_CYPHER_TOOL = 'graph_neo4j_cypher' as const

// 파일 저장소 엔드포인트
export const FILE_STORAGE_ENDPOINT =
  'https://oasis-dev-storage-api.haiqv.ai/tmp-upload/' as const

/**
 * 파일 확장자 상수 정의
 * 파일 타입별로 허용되는 확장자를 관리합니다.
 */

// Microsoft Word 파일 확장자
export const WORD_EXTENSIONS = [
  'doc',
  'dot',
  'dotx',
  'docx',
  'docm',
  'dotm',
  'dots',
] as const

// Microsoft PowerPoint 파일 확장자
export const POWERPOINT_EXTENSIONS = [
  'ppt',
  'pot',
  'pps',
  'pptx',
  'pptm',
  'potx',
  'potm',
  'ppsx',
] as const

// Microsoft Excel 파일 확장자
export const EXCEL_EXTENSIONS = [
  'xls',
  'xlt',
  'xlsx',
  'xlsm',
  'xltx',
  'xltm',
  'xlsb',
] as const

// 한글 (HWP) 파일 확장자
export const HWP_EXTENSIONS = ['hwp', 'hwt', 'hml', 'hwpx'] as const

// PDF 파일 확장자
export const PDF_EXTENSIONS = ['pdf'] as const

// 이미지 파일 확장자
export const IMAGE_EXTENSIONS = [
  'png',
  'jpeg',
  'jpg',
  'bmp',
  'tiff',
  'tif',
  'gif',
] as const

// 텍스트/기타 파일 확장자
export const TEXT_EXTENSIONS = ['txt', 'csv', 'md'] as const

// 모든 허용된 파일 확장자 (통합)
export const ALLOWED_FILE_EXTENSIONS = [
  ...WORD_EXTENSIONS,
  ...POWERPOINT_EXTENSIONS,
  ...EXCEL_EXTENSIONS,
  ...HWP_EXTENSIONS,
  ...PDF_EXTENSIONS,
  ...IMAGE_EXTENSIONS,
  ...TEXT_EXTENSIONS,
] as const

/**
 * 파일 확장자 추출
 */
export const getFileExtension = (fileName: string): string => {
  return fileName.split('.').pop()?.toLowerCase() || ''
}

/**
 * 파일 확장자가 허용된 확장자인지 확인
 */
export const isAllowedExtension = (fileName: string): boolean => {
  const extension = getFileExtension(fileName)
  return ALLOWED_FILE_EXTENSIONS.includes(extension as any)
}

/**
 * 파일이 이미지인지 확인
 */
export const isImageFile = (fileName: string): boolean => {
  const extension = getFileExtension(fileName)
  return IMAGE_EXTENSIONS.includes(extension as any)
}

/**
 * 파일이 Word 문서인지 확인
 */
export const isWordFile = (fileName: string): boolean => {
  const extension = getFileExtension(fileName)
  return WORD_EXTENSIONS.includes(extension as any)
}

/**
 * 파일이 PowerPoint 문서인지 확인
 */
export const isPowerPointFile = (fileName: string): boolean => {
  const extension = getFileExtension(fileName)
  return POWERPOINT_EXTENSIONS.includes(extension as any)
}

/**
 * 파일이 Excel 문서인지 확인
 */
export const isExcelFile = (fileName: string): boolean => {
  const extension = getFileExtension(fileName)
  return EXCEL_EXTENSIONS.includes(extension as any)
}

/**
 * 파일이 PDF인지 확인
 */
export const isPdfFile = (fileName: string): boolean => {
  const extension = getFileExtension(fileName)
  return PDF_EXTENSIONS.includes(extension as any)
}

/**
 * 파일이 HWP 문서인지 확인
 */
export const isHwpFile = (fileName: string): boolean => {
  const extension = getFileExtension(fileName)
  return HWP_EXTENSIONS.includes(extension as any)
}

/**
 * 파일이 텍스트 파일인지 확인
 */
export const isTextFile = (fileName: string): boolean => {
  const extension = getFileExtension(fileName)
  return TEXT_EXTENSIONS.includes(extension as any)
}
