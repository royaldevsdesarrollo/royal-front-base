import axios from 'axios'
import { toast } from 'sonner'
import { envConfig, HTTP_STATUS } from '@/shared/config'
import { clearMonitoringUser } from '@/shared/lib/monitoring'
import { useAuthStore } from '@/shared/stores'
import { isJwtExpired } from '@/shared/utils'
import { createSessionExpiredError, normalizeApiError } from './api-error'
import { queryClient } from './query-client'

const SESSION_EXPIRED_TOAST_ID = 'session-expired'

const clientConfig = {
  baseURL: envConfig.apiUrl,
  timeout: envConfig.apiTimeoutMs,
  headers: {
    Accept: 'application/json',
  },
}

export const publicApiClient = axios.create(clientConfig)
export const apiClient = axios.create(clientConfig)

function expireSession(cause?: unknown): Error {
  useAuthStore.getState().clearSession()
  queryClient.clear()
  clearMonitoringUser()
  toast.error('Tu sesión ha expirado', { id: SESSION_EXPIRED_TOAST_ID })

  return createSessionExpiredError(cause)
}

function getBearerToken(authorization: unknown): string | undefined {
  if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
    return undefined
  }

  return authorization.slice('Bearer '.length)
}

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken

  if (!token) {
    return config
  }

  if (isJwtExpired(token)) {
    return Promise.reject(expireSession())
  }

  config.headers.Authorization = `Bearer ${token}`

  return config
})

apiClient.interceptors.response.use(
  response => response,
  (error) => {
    const normalized = normalizeApiError(error)
    const authorization = axios.isAxiosError(error)
      ? error.config?.headers?.Authorization
      : undefined
    const requestToken = getBearerToken(authorization)
    const currentToken = useAuthStore.getState().accessToken

    if (normalized.status === HTTP_STATUS.UNAUTHORIZED && requestToken === currentToken) {
      return Promise.reject(expireSession(error))
    }

    return Promise.reject(normalized)
  },
)

publicApiClient.interceptors.response.use(
  response => response,
  error => Promise.reject(normalizeApiError(error)),
)
