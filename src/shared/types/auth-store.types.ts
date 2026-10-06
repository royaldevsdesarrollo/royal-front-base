export interface AuthState {
  accessToken: string | null
  hasHydrated: boolean
  setAccessToken: (token: string) => void
  setHasHydrated: (hasHydrated: boolean) => void
  clearSession: () => void
}
