export interface SentryConfig {
  enabled: boolean
  dsn?: string
  environment: string
  release: string
}

export interface EnvConfig {
  apiUrl: string
  apiTimeoutMs: number
  isDev: boolean
  isProd: boolean
  mode: string
  sentry: SentryConfig
}
