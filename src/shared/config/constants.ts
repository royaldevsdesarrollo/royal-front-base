export const APP_STORAGE_KEYS = {
  APP: 'royal-stack-app',
  AUTH: 'royal-stack-auth',
} as const

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    ME: '/auth/me',
  },
  TASKS: '/tasks',
} as const

export const QUERY_KEYS = {
  AUTH: ['auth', 'me'],
  TASKS: ['tasks'],
} as const

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SHOWCASE: '/showcase',
  EXAMPLE: '/example',
} as const
