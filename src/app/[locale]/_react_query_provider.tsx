'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [client] = useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false, // 윈도우가 다시 포커스 되었을 때 데이터 refetch 여부
          refetchOnMount: false, // 데이터가 stale 상태이면 컴포넌트가 마운트 될 때 refetch 여부
          retry: 2, // API 호출 실패 시 재시도 하는 옵션 (설정값 만큼 재시도)
        },
      },
    }),
  )
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
