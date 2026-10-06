import { Boxes, Home, PanelsTopLeft } from 'lucide-react'
import { matchPath } from 'react-router-dom'
import { ROUTES } from '@/shared/config'
import type { NavigationItem } from '@/shared/types'

export const NAVIGATION_ITEMS: NavigationItem[] = [
  { icon: Home, label: 'Inicio', to: ROUTES.HOME, end: true },
  { icon: PanelsTopLeft, label: 'Showcase', to: ROUTES.SHOWCASE, end: false },
  { icon: Boxes, label: 'Ejemplo', to: ROUTES.EXAMPLE, end: false },
]

export function getActiveNavigationItem(pathname: string): NavigationItem | undefined {
  return NAVIGATION_ITEMS.find(item => matchPath({ path: item.to, end: item.end }, pathname))
}
