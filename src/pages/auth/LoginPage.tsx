import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Blocks, ShieldCheck } from 'lucide-react'
import { LoginForm } from '@/modules/auth'
import type { LoginLocationState } from '@/modules/auth'
import { FullPageLoader, ThemeMenu } from '@/shared/components'
import { Badge, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui'
import { envConfig, ROUTES } from '@/shared/config'
import { selectAccessToken, selectHasHydrated, useAuthStore } from '@/shared/stores'

export function LoginPage() {
  const accessToken = useAuthStore(selectAccessToken)
  const hasHydrated = useAuthStore(selectHasHydrated)
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as LoginLocationState | null
  const destination = state?.from?.pathname ?? ROUTES.HOME

  if (!hasHydrated) {
    return <FullPageLoader label="Restaurando sesión" />
  }

  if (accessToken) {
    return <Navigate to={ROUTES.HOME} replace />
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-muted/40 p-4">
      <div className="absolute right-4 top-4">
        <ThemeMenu />
      </div>

      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl border bg-card shadow-xl lg:grid-cols-2">
        <section className="hidden bg-primary p-10 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
          <div className="flex items-center gap-3 font-semibold">
            <span className="grid size-10 place-items-center rounded-xl bg-primary-foreground text-primary">R</span>
            Royal Stack Web
          </div>
          <div className="space-y-4">
            <Badge variant="secondary">Scaffold modular</Badge>
            <h1 className="text-4xl font-semibold tracking-tight">
              Una base lista para construir, no para volver a configurar.
            </h1>
            <p className="text-primary-foreground/75">
              Auth, API, estado, monitoreo, componentes y arquitectura con contratos claros.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-primary-foreground/75">
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4" />
              {' '}
              Sesión validada
            </span>
            <span className="flex items-center gap-2">
              <Blocks className="size-4" />
              {' '}
              Módulos aislados
            </span>
          </div>
        </section>

        <Card className="border-0 shadow-none">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl">Iniciar sesión</CardTitle>
            <CardDescription>
              Accede al scaffold y sus ejemplos protegidos.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {envConfig.mockApiEnabled && (
              <div className="rounded-lg border border-dashed bg-muted/50 p-3 text-sm text-muted-foreground">
                Mock activo:
                {' '}
                <strong>demo@royalstack.dev</strong>
                {' '}
                /
                {' '}
                <strong>demo1234</strong>
              </div>
            )}
            <LoginForm onSuccess={() => navigate(destination, { replace: true })} />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
