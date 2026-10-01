export type AppTheme = 'light' | 'dark' | 'system'

export interface AppState {
  theme: AppTheme
  sidebarOpen: boolean
  setTheme: (theme: AppTheme) => void
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
}
