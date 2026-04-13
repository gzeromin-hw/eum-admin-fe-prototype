import React from 'react'

/**
 * 텍스트에서 검색어를 하이라이트하는 함수
 * @param text - 하이라이트할 텍스트
 * @param searchTerm - 검색어
 * @returns 하이라이트된 JSX 요소 또는 원본 텍스트
 */
export const highlightText = (
  text: string | null,
  searchTerm: string,
): React.ReactNode => {
  if (!text || !searchTerm.trim()) {
    return text || ''
  }

  const regex = new RegExp(
    `(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`,
    'gi',
  )
  const parts = text.split(regex)

  const elements = parts
    .map((part, index) => {
      // 빈 문자열은 건너뛰기
      if (part === '') {
        return null
      }

      // 검색어와 일치하는 부분은 하이라이트
      if (regex.test(part)) {
        return React.createElement(
          'span',
          {
            key: 'highlight-text-' + part + '-' + index,
            className: 'text-primary-normal',
          },
          part,
        )
      }
      return part
    })
    .filter(Boolean) // null 제거

  // 단일 요소인 경우 Fragment 없이 반환
  if (elements.length === 1) {
    return elements[0]
  }

  // 여러 요소인 경우 Fragment로 감싸서 반환
  return React.createElement(React.Fragment, null, ...elements)
}

/**
 * URL-safe Base64로 인코딩된 문자열을 UTF-8로 디코딩하는 함수
 * 입력값이 이미 일반 문자열(한글 등 포함)이면 그대로 반환
 * @param value - 디코딩할 Base64 문자열 또는 일반 문자열
 * @returns 디코딩된 문자열 또는 원본 문자열 또는 null
 */
export const decodeBase64String = (value: string | null): string | null => {
  if (!value) return null

  try {
    // 공백 제거 및 트림
    const trimmed = value.trim()
    if (!trimmed) return null

    // Base64가 아닌 일반 문자열인지 확인
    // Base64는 A-Z, a-z, 0-9, +, /, =, -, _ 만 포함
    // 한글이나 다른 특수문자가 포함되어 있으면 일반 문자열로 간주
    const base64Pattern = /^[A-Za-z0-9+/=\-_]+$/

    // Base64 패턴에 맞지 않으면 일반 문자열로 간주하여 그대로 반환
    if (!base64Pattern.test(trimmed)) {
      return trimmed
    }

    // URL-safe Base64를 일반 Base64로 변환
    let base64 = trimmed.replace(/-/g, '+').replace(/_/g, '/')

    // Base64 패딩 추가 (4의 배수 길이로 만들기)
    const paddingNeeded = (4 - (base64.length % 4)) % 4
    base64 += '='.repeat(paddingNeeded)

    // UTF-8 바이트를 올바르게 디코딩
    const binaryString = atob(base64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }

    // UTF-8 디코딩
    return new TextDecoder('utf-8').decode(bytes)
  } catch (error) {
    // 디코딩 실패 시 원본 문자열 반환 (이미 일반 문자열일 가능성)
    // 에러 로깅은 개발 환경에서만
    if (process.env.NODE_ENV === 'development') {
      console.error('Base64 디코딩 실패:', error, '입력값:', value)
    }
    // 디코딩 실패 시 원본 문자열 반환
    return value.trim()
  }
}

/**
 * UUID v4 형식의 세션 ID를 생성하는 함수
 * @returns UUID v4 형식의 문자열
 */
export const generateSessionUuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * 바이트 크기를 읽기 쉬운 형식으로 변환하는 함수
 * @param bytes - 변환할 바이트 크기
 * @returns 포맷된 파일 크기 문자열 (예: "1.5 MB")
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}
