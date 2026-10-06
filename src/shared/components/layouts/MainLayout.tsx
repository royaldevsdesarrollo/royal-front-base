import { Link, Outlet, useLocation } from 'react-router-dom'
import { ThemeMenu } from '@/shared/components/common'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  Separator,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/shared/components/ui'
import { ROUTES } from '@/shared/config'
import { useAppStore } from '@/shared/stores'
import type { LayoutUser } from '@/shared/types'
import { AppSidebar } from './AppSidebar'
import { getActiveNavigationItem } from './navigation.config'

interface MainLayoutProps {
  user: LayoutUser
  onLogout: () => void
}

export function MainLayout({ onLogout, user }: MainLayoutProps) {
  const location = useLocation()
  const sidebarOpen = useAppStore(state => state.sidebarOpen)
  const setSidebarOpen = useAppStore(state => state.setSidebarOpen)
  const activeItem = getActiveNavigationItem(location.pathname)

  return (
    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
      <AppSidebar user={user} onLogout={onLogout} />
      <SidebarInset className="min-w-0 overflow-x-hidden">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/90 px-4 backdrop-blur">
          <SidebarTrigger type="button" aria-label="Alternar navegación" />
          <Separator orientation="vertical" className="h-4" />
          <Breadcrumb className="min-w-0">
            <BreadcrumbList className="flex-nowrap">
              {activeItem?.to !== ROUTES.HOME && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to={ROUTES.HOME}>Inicio</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem className="min-w-0">
                <BreadcrumbPage className="truncate">
                  {activeItem?.label ?? 'Royal Stack'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto">
            <ThemeMenu />
          </div>
        </header>
        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
