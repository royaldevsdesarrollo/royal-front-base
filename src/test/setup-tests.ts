import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './server'
import { queryClient } from '@/shared/lib/api'
import { useAppStore, useAuthStore } from '@/shared/stores'

class ResizeObserverMock implements ResizeObserver {
  disconnect(): void {}
  observe(): void {}
  unobserve(): void {}
}

beforeAll(() => {
  globalThis.ResizeObserver = ResizeObserverMock

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }),
  })

  server.listen({ onUnhandledFrame: 'error' })
})

afterEach(() => {
  cleanup()
  server.resetHandlers()
  queryClient.clear()
  useAuthStore.getState().clearSession()
  useAppStore.setState({ sidebarOpen: true, theme: 'system' })
  localStorage.clear()
})

afterAll(() => server.close())
