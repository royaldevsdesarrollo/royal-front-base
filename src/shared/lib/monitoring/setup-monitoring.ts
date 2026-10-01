import { envConfig } from '@/shared/config'
import { configureMonitoring } from './monitoring'

let setupPromise: Promise<void> | undefined

/** Inicializa el proveedor configurado una sola vez. Sin DSN, permanece como no-op. */
export function setupMonitoring(): Promise<void> {
  if (!envConfig.sentry.enabled) {
    return Promise.resolve()
  }

  setupPromise ??= import('./sentry.adapter')
    .then(({ createSentryAdapter }) => {
      configureMonitoring(createSentryAdapter(envConfig.sentry))
    })
    .catch((error) => {
      console.error('[Monitoring] No fue posible inicializar Sentry', error)
    })

  return setupPromise
}
