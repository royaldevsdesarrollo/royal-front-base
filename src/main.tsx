import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/App'
import '@/shared/assets/styles/index.css'
import { envConfig } from '@/shared/config'
import { setupMonitoring } from '@/shared/lib/monitoring'

async function enableApiMock(): Promise<void> {
  if (!envConfig.mockApiEnabled) {
    return
  }

  const { worker } = await import('@/mocks/browser')
  await worker.start({ onUnhandledFrame: 'bypass' })
}

async function bootstrap(): Promise<void> {
  await Promise.all([setupMonitoring(), enableApiMock()])

  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('No se encontró el elemento raíz de la aplicación')
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

void bootstrap()
