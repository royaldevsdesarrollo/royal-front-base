import * as Sentry from '@sentry/react'
import type { MonitoringAdapter, SentryConfig } from '@/shared/types'

const SENSITIVE_QUERY_PARAMS = ['token', 'access_token', 'authorization']
const SENSITIVE_HEADERS = ['authorization', 'cookie', 'set-cookie']

function sanitizeUrl(url: string): string {
  try {
    const sanitizedUrl = new URL(url, globalThis.location.origin)

    for (const parameter of SENSITIVE_QUERY_PARAMS) {
      sanitizedUrl.searchParams.delete(parameter)
    }

    return sanitizedUrl.toString()
  }
  catch {
    return url
  }
}

function sanitizeError(error: unknown): unknown {
  if (!(error instanceof Error)) {
    return error
  }

  const sanitized = new Error(error.message)
  sanitized.name = error.name
  sanitized.stack = error.stack

  return sanitized
}

export function createSentryAdapter(config: SentryConfig): MonitoringAdapter {
  Sentry.init({
    dsn: config.dsn,
    enabled: config.enabled,
    environment: config.environment,
    release: config.release,
    beforeSend: (event) => {
      if (event.request?.headers) {
        for (const header of Object.keys(event.request.headers)) {
          if (SENSITIVE_HEADERS.includes(header.toLowerCase())) {
            delete event.request.headers[header]
          }
        }
      }

      if (event.request?.url) {
        event.request.url = sanitizeUrl(event.request.url)
      }

      return event
    },
  })

  return {
    captureException: (error, context) => {
      Sentry.captureException(sanitizeError(error), { extra: context })
    },
    captureMessage: (message, context) => {
      Sentry.captureMessage(message, { extra: context })
    },
    setUser: (user) => {
      Sentry.setUser({ id: user.id })
    },
    clearUser: () => {
      Sentry.setUser(null)
    },
  }
}
