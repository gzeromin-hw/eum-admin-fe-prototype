'use client'

import { Slide, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import '@/styles/toast.css'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { getStatusIconPath, StatusIconType } from '@/utils/icon.util'

export default function ReactToastify() {
  const { theme } = useTheme()

  // 타입과 테마에 따라 아이콘 경로를 반환하는 공통 유틸 사용
  const toStatusType = (type: string): StatusIconType => {
    if (type === 'success' || type === 'warning') return type
    return 'error'
  }
  const getIconPath = (type: string) =>
    getStatusIconPath(toStatusType(type), theme)

  return (
    <ToastContainer
      autoClose={2000}
      theme={theme === 'dark' ? 'dark' : 'light'}
      pauseOnHover={true}
      closeOnClick={true}
      position="top-right"
      newestOnTop={false}
      rtl={false}
      transition={Slide}
      icon={({ type }) => (
        <Image
          src={getIconPath(type)}
          alt={`${type} icon`}
          width={32}
          height={32}
          className="h-8 w-8"
        />
      )}
      data-id="toast-container"
    />
  )
}
