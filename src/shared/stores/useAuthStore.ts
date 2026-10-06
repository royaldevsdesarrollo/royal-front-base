import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { APP_STORAGE_KEYS, envConfig } from '@/shared/config'
import type { AuthState } from '@/shared/types'
import { isJwtExpired } from '@/shared/utils'

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      set => ({
        accessToken: null,
        hasHydrated: false,
        setAccessToken: (accessToken) => {
          set({ accessToken: isJwtExpired(accessToken) ? null : accessToken })
        },
        clearSession: () => set({ accessToken: null }),
        setHasHydrated: hasHydrated => set({ hasHydrated }),
      }),
      {
        name: APP_STORAGE_KEYS.AUTH,
        partialize: state => ({ accessToken: state.accessToken }),
        onRehydrateStorage: () => (state) => {
          if (state?.accessToken && isJwtExpired(state.accessToken)) {
            state.clearSession()
          }

          state?.setHasHydrated(true)
        },
      },
    ),
    { name: 'AuthStore', enabled: envConfig.isDev },
  ),
)

export const selectAccessToken = (state: AuthState) => state.accessToken
export const selectIsAuthenticated = (state: AuthState) => state.accessToken !== null
export const selectHasHydrated = (state: AuthState) => state.hasHydrated
