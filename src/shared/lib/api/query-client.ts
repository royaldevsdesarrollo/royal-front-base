import { MutationCache, QueryCache, QueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getErrorMessage,
  isCanceledError,
  isSessionExpiredError,
  normalizeApiError,
  shouldReportError,
} from './api-error'
import { reportError } from '@/shared/lib/monitoring'

function retryQuery(failureCount: number, error: unknown): boolean {
  const normalized = normalizeApiError(error)

  if (normalized.kind === 'canceled' || normalized.kind === 'session-expired') {
    return false
  }

  if (normalized.status && normalized.status < 500) {
    return false
  }

  return failureCount < 2
}

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (!query.meta?.skipErrorReporting && shouldReportError(error)) {
        reportError(error, {
          source: 'query',
          queryHash: query.queryHash,
          queryKey: query.queryKey,
        })
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error, _variables, _context, mutation) => {
      if (!mutation.meta?.skipErrorReporting && shouldReportError(error)) {
        reportError(error, {
          source: 'mutation',
          mutationKey: mutation.options.mutationKey,
        })
      }

      if (
        mutation.meta?.skipGlobalErrorToast
        || isCanceledError(error)
        || isSessionExpiredError(error)
      ) {
        return
      }

      toast.error(mutation.meta?.errorMessage ?? getErrorMessage(error))
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 600_000,
      refetchOnWindowFocus: false,
      retry: retryQuery,
    },
    mutations: {
      retry: false,
    },
  },
})
