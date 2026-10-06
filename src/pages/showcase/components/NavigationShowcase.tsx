import { Bell, Home, Settings } from 'lucide-react'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/shared/components/ui'
import { ShowcaseSection } from './ShowcaseSection'

export function NavigationShowcase() {
  return (
    <ShowcaseSection
      title="Navegación lateral"
      description="Primitivas del Sidebar oficial para estados normales, activos y con indicadores."
    >
      <div className="max-w-sm rounded-xl border border-sidebar-border bg-sidebar text-sidebar-foreground">
        <SidebarGroup>
          <SidebarGroupLabel>Espacio de trabajo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton type="button" isActive>
                  <Home />
                  <span>Vista general</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton type="button">
                  <Bell />
                  <span>Notificaciones</span>
                </SidebarMenuButton>
                <SidebarMenuBadge>4</SidebarMenuBadge>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton type="button">
                  <Settings />
                  <span>Configuración</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </div>
    </ShowcaseSection>
  )
}
