import axios from 'axios'
import { HTTP_STATUS } from '@/shared/config'
import type { ApiErrorPayload, AppErrorKind, AppErrorOptions } from '@/shared/types'

const STATUS_MESSAGES: Partial<Record<number, string>> = {
  [HTTP_STATUS.BAD_REQUEST]: 'La solicitud no es válida',
  [HTTP_STATUS.UNAUTHORIZED]: 'No fue posible autorizar la solicitud',
  [HTTP_STATUS.FORBIDDEN]: 'No tienes permisos para realizar esta acción',
  [HTTP_STATUS.NOT_FOUND]: 'No se encontró el recurso solicitado',
  [HTTP_STATUS.CONFLICT]: 'La operación entra en conflicto con el estado actual',
  [HTTP_STATUS.UNPROCESSABLE_ENTITY]: 'La información enviada no es válida',
  [HTTP_STATUS.TOO_MANY_REQUESTS]: 'Demasiadas solicitudes. Intenta nuevamente más tarde',
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: 'Ocurrió un error en el servidor',
}

export class AppError extends Error {
  readonly status?: number
  readonly code?: string
  readonly kind: AppErrorKind
  readonly fieldErrors?: Record<string, string[]>

  constructor(message: string, options: AppErrorOptions = {}) {
    super(message, { cause: options.cause })
    this.name = 'AppError'
    this.status = options.status
    this.code = options.code
    this.kind = options.kind ?? 'unknown'
    this.fieldErrors = options.fieldErrors
  }
}

function getKind(status?: number): AppErrorKind {
  if (status === HTTP_STATUS.UNAUTHORIZED) {
    return 'unauthorized'
  }

  if (status === HTTP_STATUS.UNPROCESSABLE_ENTITY) {
    return 'validation'
  }

  return 'api'
}

function getPayload(data: unknown): ApiErrorPayload | undefined {
  if (typeof data !== 'object' || data === null) {
    return undefined
  }

  return data
}

export function normalizeApiError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }

  if (axios.isCancel(error)) {
    return new AppError('La solicitud fue cancelada', { kind: 'canceled', cause: error })
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const payload = getPayload(error.response?.data)
    const fallback = status ? STATUS_MESSAGES[status] : undefined
    const message = payload?.message || fallback || error.message || 'No fue posible conectar con el servidor'

    return new AppError(message, {
      status,
      code: payload?.code,
      kind: status ? getKind(status) : 'network',
      fieldErrors: payload?.errors,
      cause: error,
    })
  }

  if (error instanceof Error) {
    return new AppError(error.message, { kind: 'unknown', cause: error })
  }

  if (typeof error === 'string') {
    return new AppError(error, { kind: 'unknown' })
  }

  return new AppError('Ocurrió un error inesperado', { kind: 'unknown', cause: error })
}

export function createSessionExpiredError(cause?: unknown): AppError {
  return new AppError('Tu sesión ha expirado', {
    status: HTTP_STATUS.UNAUTHORIZED,
    code: 'SESSION_EXPIRED',
    kind: 'session-expired',
    cause,
  })
}

export function getErrorMessage(
  error: unknown,
  fallback = 'Ocurrió un error inesperado',
): string {
  return normalizeApiError(error).message || fallback
}

export function isCanceledError(error: unknown): boolean {
  return normalizeApiError(error).kind === 'canceled'
}

export function isSessionExpiredError(error: unknown): boolean {
  return normalizeApiError(error).kind === 'session-expired'
}

export function shouldReportError(error: unknown): boolean {
  const normalized = normalizeApiError(error)

  return normalized.kind === 'unknown' || (normalized.status ?? 0) >= 500
}
