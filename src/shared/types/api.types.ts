export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginationMeta {
  totalItems: number
  itemsPerPage: number
  totalPages: number
  currentPage: number
}

export interface PaginatedResponse<T> {
  items: T[]
  meta: PaginationMeta
}

export interface ApiErrorPayload {
  message?: string
  statusCode?: number
  code?: string
  errors?: Record<string, string[]>
}

export type AppErrorKind
  = | 'api'
    | 'network'
    | 'validation'
    | 'unauthorized'
    | 'session-expired'
    | 'canceled'
    | 'unknown'

export interface AppErrorOptions {
  status?: number
  code?: string
  kind?: AppErrorKind
  fieldErrors?: Record<string, string[]>
  cause?: unknown
}
