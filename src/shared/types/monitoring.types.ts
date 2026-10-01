export type MonitoringContext = Record<string, unknown>

export interface MonitoringUser {
  id: string
}

export interface MonitoringAdapter {
  captureException: (error: unknown, context?: MonitoringContext) => void
  captureMessage: (message: string, context?: MonitoringContext) => void
  setUser: (user: MonitoringUser) => void
  clearUser: () => void
}
