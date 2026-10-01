import '@tanstack/react-query'

interface AppQueryMeta extends Record<string, unknown> {
  skipErrorReporting?: boolean
}

interface AppMutationMeta extends AppQueryMeta {
  skipGlobalErrorToast?: boolean
  errorMessage?: string
}

declare module '@tanstack/react-query' {
  interface Register {
    queryMeta: AppQueryMeta
    mutationMeta: AppMutationMeta
  }
}

export {}
