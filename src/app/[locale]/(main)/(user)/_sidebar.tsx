'use client'

import { useEffect, type MouseEvent as ReactMouseEvent } from 'react'
import { Link, usePathname } from '@/i18n/navigation'
import clsx from 'clsx'
import {
  BarChart3Icon,
  BookOpenIcon,
  CheckIcon,
  ChevronsUpDownIcon,
  DatabaseIcon,
  FileTextIcon,
  LineChartIcon,
  MessageSquareIcon,
  PanelLeftIcon,
  PlayIcon,
  Share2Icon,
  UsersIcon,
} from 'lucide-react'
import {
  Sidebar as AppSidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import useSchemaSelectorStore from '@/hooks/store/schema-selector'

export const SIDEBAR_MIN_WIDTH = 180
export const SIDEBAR_MAX_WIDTH = 250
export const SIDEBAR_DEFAULT_WIDTH = 200

interface SidebarProps {
  onResizeStart: (event: ReactMouseEvent<HTMLDivElement>) => void
}

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

const navItems: NavItem[] = [
  {
    label: '쿼리 실행',
    href: '/query-execution',
    icon: <PlayIcon size={20} strokeWidth={2} />,
  },
  {
    label: '스키마 관리',
    href: '/schema-management',
    icon: <DatabaseIcon size={20} strokeWidth={2} />,
  },
  {
    label: '스키마 후보 관리',
    href: '/schema-candidate-management',
    icon: <FileTextIcon size={20} strokeWidth={2} />,
  },
  {
    label: '추출 프롬프트 관리',
    href: '/extraction-prompt-management',
    icon: <MessageSquareIcon size={20} strokeWidth={2} />,
  },
  {
    label: '데이터 사전 관리',
    href: '/data-dictionary-management',
    icon: <BookOpenIcon size={20} strokeWidth={2} />,
  },
]

const bottomNavItems: NavItem[] = [
  {
    label: '리액트 플로우 테스트',
    href: '/react-flow-test',
    icon: <Share2Icon size={20} strokeWidth={2} />,
  },
  {
    label: '메트릭 모니터링',
    href: '/metric-monitoring',
    icon: <BarChart3Icon size={20} strokeWidth={2} />,
  },
  {
    label: '통계 리포트',
    href: '/statistics-report',
    icon: <LineChartIcon size={20} strokeWidth={2} />,
  },
  {
    label: '사용자 관리',
    href: '/user-management',
    icon: <UsersIcon size={20} strokeWidth={2} />,
  },
]

function isPathActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/'
  return pathname === href || pathname.startsWith(`${href}/`)
}

function SchemaSwitcher() {
  const selectedId = useSchemaSelectorStore(s => s.selectedId)
  const options = useSchemaSelectorStore(s => s.options)
  const setSelectedId = useSchemaSelectorStore(s => s.setSelectedId)
  const loadSchemas = useSchemaSelectorStore(s => s.loadSchemas)
  const hydrateFromStorage = useSchemaSelectorStore(s => s.hydrateFromStorage)

  useEffect(() => {
    hydrateFromStorage()
    loadSchemas()
  }, [hydrateFromStorage, loadSchemas])

  const selectedOption = options.find(o => o.id === selectedId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="hover:bg-background-alternative group-data-[collapsible=icon]:justify-center flex w-full cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 transition-colors">
          <div className="bg-primary-normal/10 flex h-7 w-7 shrink-0 items-center justify-center rounded-sm">
            <DatabaseIcon size={14} className="text-primary-normal" />
          </div>
          <div className="group-data-[collapsible=icon]:hidden min-w-0 flex-1 text-left">
            <p className="text-strong truncate text-sm font-semibold leading-tight">
              {selectedOption?.label ?? '스키마 없음'}
            </p>
            <p className="text-assistive truncate text-[11px] leading-tight">
              {selectedOption?.statusLabel ?? ''}
            </p>
          </div>
          <ChevronsUpDownIcon size={13} className="text-icon-normal group-data-[collapsible=icon]:hidden shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="start" className="w-56">
        {options.length === 0 ? (
          <DropdownMenuItem disabled>스키마 없음</DropdownMenuItem>
        ) : (
          options.map(option => (
            <DropdownMenuItem
              key={option.id}
              onClick={() => setSelectedId(option.id)}
              className="gap-2"
            >
              <span className="flex-1 truncate">{option.label}</span>
              <span className="text-assistive shrink-0 text-xs">{option.statusLabel}</span>
              {option.id === selectedId && (
                <CheckIcon size={14} className="text-primary-normal shrink-0" />
              )}
            </DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SidebarHeaderContent() {
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === 'collapsed'

  return (
    <div className="border-line-normal flex h-(--header-height) shrink-0 items-center border-b pr-3 pl-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
      <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
        <span className="text-strong truncate text-base font-semibold px-1">
          메뉴
        </span>
      </div>
      <button
        onClick={toggleSidebar}
        className="text-icon-normal hover:bg-background-alternative ml-auto flex h-8 w-8 shrink-0 items-center justify-center rounded-sm transition-colors group-data-[collapsible=icon]:ml-0"
        aria-label={isCollapsed ? '사이드바 열기' : '사이드바 접기'}
        title={isCollapsed ? '사이드바 열기' : '사이드바 접기'}
      >
        <PanelLeftIcon size={18} />
      </button>
    </div>
  )
}

export default function Sidebar({ onResizeStart }: SidebarProps) {
  const pathname = usePathname()

  return (
    <AppSidebar
      collapsible="icon"
      className="border-line-normal bg-background-normal **:data-[slot=sidebar-inner]:bg-background-normal top-(--header-height) h-auto border-r"
    >
      <SidebarHeader className="p-0">
        <SidebarHeaderContent />
        <div className="px-2 pb-1 pt-2">
          <SchemaSwitcher />
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map(item => {
            const isActive = isPathActive(pathname, item.href)
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={isActive}
                  tooltip={item.label}
                  className={clsx(
                    'relative h-10 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-background-alternative text-primary-normal before:bg-primary-normal before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:w-0.5'
                      : 'text-neutral hover:bg-background-alternative hover:text-strong',
                  )}
                >
                  <span className={clsx('shrink-0', isActive ? 'text-primary-normal' : 'text-icon-normal')}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <div className="border-line-normal border-t p-2">
        <SidebarMenu>
          {bottomNavItems.map(item => {
            const isActive = isPathActive(pathname, item.href)
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  render={<Link href={item.href} />}
                  isActive={isActive}
                  tooltip={item.label}
                  className={clsx(
                    'relative h-10 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-background-alternative text-primary-normal before:bg-primary-normal before:absolute before:top-1.5 before:bottom-1.5 before:left-0 before:w-0.5'
                      : 'text-neutral hover:bg-background-alternative hover:text-strong',
                  )}
                >
                  <span className={clsx('shrink-0', isActive ? 'text-primary-normal' : 'text-icon-normal')}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </div>

      <div
        onMouseDown={onResizeStart}
        className="hover:bg-line-normal/50 absolute top-0 right-0 z-30 block h-full w-1 cursor-col-resize bg-transparent transition-colors"
        aria-hidden
      />
    </AppSidebar>
  )
}
