import type {
  MonitoringAdapter,
  MonitoringContext,
  MonitoringUser,
} from '@/shared/types'

const noOpAdapter: MonitoringAdapter = {
  captureException: () => undefined,
  captureMessage: () => undefined,
  setUser: () => undefined,
  clearUser: () => undefined,
}

let activeAdapter = noOpAdapter

export function configureMonitoring(adapter: MonitoringAdapter): void {
  activeAdapter = adapter
}

export function reportError(error: unknown, context?: MonitoringContext): void {
  activeAdapter.captureException(error, context)
}

export function reportMessage(message: string, context?: MonitoringContext): void {
  activeAdapter.captureMessage(message, context)
}

export function setMonitoringUser(user: MonitoringUser): void {
  activeAdapter.setUser(user)
}

export function clearMonitoringUser(): void {
  activeAdapter.clearUser()
}
