export interface SentryConfig {
  enabled: boolean
  dsn?: string
  environment: string
  release: string
}

export interface EnvConfig {
  apiUrl: string
  apiTimeoutMs: number
  mockApiEnabled: boolean
  isDev: boolean
  isProd: boolean
  mode: string
  sentry: SentryConfig
}
