import type { LucideIcon } from 'lucide-react'

export interface NavigationItem {
  end: boolean
  icon: LucideIcon
  label: string
  to: string
}

export interface LayoutUser {
  email: string
  name: string
  role: string
}
