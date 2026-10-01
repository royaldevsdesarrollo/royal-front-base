import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { APP_STORAGE_KEYS, envConfig } from '@/shared/config'
import type { AppState } from '@/shared/types'

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      set => ({
        theme: 'system',
        sidebarOpen: false,
        setTheme: theme => set({ theme }),
        setSidebarOpen: sidebarOpen => set({ sidebarOpen }),
        toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
      }),
      {
        name: APP_STORAGE_KEYS.APP,
        partialize: state => ({ theme: state.theme }),
      },
    ),
    { name: 'AppStore', enabled: envConfig.isDev },
  ),
)
