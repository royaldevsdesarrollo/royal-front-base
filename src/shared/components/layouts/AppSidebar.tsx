import { LogOut } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  Avatar,
  AvatarFallback,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/shared/components/ui'
import { ROUTES } from '@/shared/config'
import type { LayoutUser } from '@/shared/types'
import { getActiveNavigationItem, NAVIGATION_ITEMS } from './navigation.config'

interface AppSidebarProps {
  user: LayoutUser
  onLogout: () => void
}

export function AppSidebar({ onLogout, user }: AppSidebarProps) {
  const location = useLocation()
  const { isMobile, setOpenMobile } = useSidebar()
  const activeItem = getActiveNavigationItem(location.pathname)
  const initials = user.name
    .split(' ')
    .map(part => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const closeMobileSidebar = () => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="Royal Stack">
              <NavLink to={ROUTES.HOME} onClick={closeMobileSidebar}>
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-sidebar-primary font-semibold text-sidebar-primary-foreground">
                  R
                </span>
                <span className="grid min-w-0 flex-1 text-left leading-tight">
                  <span className="truncate font-semibold">Royal Stack</span>
                  <span className="truncate text-xs text-sidebar-foreground/65">Frontend scaffold</span>
                </span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Aplicación</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAVIGATION_ITEMS.map(({ end, icon: Icon, label, to }) => (
                <SidebarMenuItem key={to}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeItem?.to === to}
                    tooltip={label}
                  >
                    <NavLink to={to} end={end} onClick={closeMobileSidebar}>
                      <Icon />
                      <span>{label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton type="button" size="lg" tooltip={`${user.name} · ${user.role}`}>
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <span className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-sidebar-foreground/65">{user.email}</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton type="button" tooltip="Cerrar sesión" onClick={onLogout}>
              <LogOut />
              <span>Cerrar sesión</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
