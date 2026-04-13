'use client'

import { useEffect, useRef } from 'react'
import { usersClient } from '@/service/api/account.client'
import useAuthStore from '@/hooks/store/auth'
import useLoadingStore from '@/hooks/store/loading'
import { useRouter } from '@/i18n/navigation'
import Header from './(user)/_header'
import { TooltipProvider } from '@/components/ui/tooltip'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { login, logout } = useAuthStore()
  const { setIsLoading } = useLoadingStore()
  const hasCheckedAuth = useRef(false)

  // useEffect(() => {
  //   // React Strict Mode에서 중복 실행되는 것을 방지한다.
  //   if (hasCheckedAuth.current) return
  //   hasCheckedAuth.current = true

  //   setIsLoading(true)
  //   usersClient
  //     .me()
  //     .then(user => {
  //       login(user)
  //     })
  //     .catch(async () => {
  //       await logout()
  //       router.replace('/login')
  //     })
  //     .finally(() => {
  //       setIsLoading(false)
  //     })
  // }, [])

  return (
    <TooltipProvider>
      <div className="flex h-screen flex-col overflow-hidden">
        <Header />
        <main className="bg-background-alternative flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </TooltipProvider>
  )
}
