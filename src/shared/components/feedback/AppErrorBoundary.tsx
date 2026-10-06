import { ErrorBoundary } from 'react-error-boundary'
import { AlertTriangle } from 'lucide-react'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui'
import { reportError } from '@/shared/lib/monitoring'

function ErrorFallback() {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <Card className="max-w-md">
        <CardHeader>
          <AlertTriangle className="size-8 text-destructive" />
          <CardTitle>La aplicación encontró un error</CardTitle>
          <CardDescription>
            Recarga la página para intentarlo de nuevo. Si el problema continúa, revisa el
            monitoreo configurado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button type="button" onClick={() => window.location.reload()}>
            Recargar aplicación
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}

export function AppErrorBoundary({ children }: React.PropsWithChildren) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => reportError(error, {
        source: 'render',
        componentStack: info.componentStack,
      })}
    >
      {children}
    </ErrorBoundary>
  )
}
