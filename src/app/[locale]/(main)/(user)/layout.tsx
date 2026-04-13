'use client'

import { useCallback, useMemo, useState } from 'react'
import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react'
import Sidebar, {
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_MAX_WIDTH,
  SIDEBAR_MIN_WIDTH,
} from './_sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarWidth, setSidebarWidth] = useState(SIDEBAR_DEFAULT_WIDTH)

  const handleResizeStart = useCallback(
    (event: ReactMouseEvent<HTMLDivElement>) => {
      event.preventDefault()

      const onMouseMove = (moveEvent: MouseEvent) => {
        setSidebarWidth(
          clamp(moveEvent.clientX, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH),
        )
      }

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp, { once: true })
    },
    [],
  )

  const sidebarStyle = useMemo(
    () => ({ '--sidebar-width': `${sidebarWidth}px` }) as CSSProperties,
    [sidebarWidth],
  )

  return (
    <SidebarProvider
      style={sidebarStyle}
      className="min-h-0 flex-1"
    >
      <Sidebar onResizeStart={handleResizeStart} />
      <SidebarInset className="flex flex-1 flex-col overflow-hidden">
        <main className="bg-background-alternative flex-1 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
