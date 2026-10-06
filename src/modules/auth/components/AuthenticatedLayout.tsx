import { Navigate, useLocation } from 'react-router-dom'
import { AlertCircle } from 'lucide-react'
import { useCurrentUser, useLogout } from '@/modules/auth/hooks'
import { FullPageLoader, MainLayout } from '@/shared/components'
import { Alert, AlertDescription, AlertTitle, Button } from '@/shared/components/ui'
import { ROUTES } from '@/shared/config'
import { selectAccessToken, selectHasHydrated, useAuthStore } from '@/shared/stores'

export function AuthenticatedLayout() {
  const hasHydrated = useAuthStore(selectHasHydrated)
  const accessToken = useAuthStore(selectAccessToken)
  const location = useLocation()
  const logout = useLogout()
  const currentUser = useCurrentUser(hasHydrated && accessToken !== null)

  if (!hasHydrated) {
    return <FullPageLoader label="Restaurando sesión" />
  }

  if (!accessToken) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  if (currentUser.isPending) {
    return <FullPageLoader label="Validando sesión" />
  }

  if (currentUser.isError || !currentUser.data) {
    return (
      <main className="grid min-h-screen place-items-center p-6">
        <Alert variant="destructive" className="max-w-lg">
          <AlertCircle />
          <AlertTitle>No fue posible validar tu sesión</AlertTitle>
          <AlertDescription className="space-y-3">
            <p>Comprueba tu conexión e inténtalo nuevamente.</p>
            <div className="flex gap-2">
              <Button type="button" size="sm" onClick={() => { void currentUser.refetch() }}>
                Reintentar
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={logout}>
                Cerrar sesión
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </main>
    )
  }

  return (
    <MainLayout
      user={{
        email: currentUser.data.email,
        name: currentUser.data.name,
        role: currentUser.data.role,
      }}
      onLogout={logout}
    />
  )
}
