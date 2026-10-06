import { envSchema } from './env.schema'
import type { EnvConfig } from '@/shared/types'

const parsedEnv = envSchema.safeParse({
  ...import.meta.env,
  VITE_SENTRY_ENVIRONMENT: import.meta.env.VITE_SENTRY_ENVIRONMENT || import.meta.env.MODE,
})

if (!parsedEnv.success) {
  const details = parsedEnv.error.issues
    .map(issue => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ')

  throw new Error(`Configuración de entorno inválida: ${details}`)
}

export const envConfig: EnvConfig = {
  apiUrl: parsedEnv.data.VITE_API_URL,
  apiTimeoutMs: parsedEnv.data.VITE_API_TIMEOUT_MS,
  mockApiEnabled: parsedEnv.data.VITE_API_MOCK_ENABLED && import.meta.env.DEV,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  mode: import.meta.env.MODE,
  sentry: {
    enabled: parsedEnv.data.VITE_SENTRY_ENABLED,
    dsn: parsedEnv.data.VITE_SENTRY_DSN,
    environment: parsedEnv.data.VITE_SENTRY_ENVIRONMENT,
    release: parsedEnv.data.VITE_SENTRY_RELEASE,
  },
}
