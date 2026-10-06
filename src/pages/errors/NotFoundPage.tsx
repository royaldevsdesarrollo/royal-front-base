import { Link } from 'react-router-dom'
import { Button } from '@/shared/components/ui'
import { ROUTES } from '@/shared/config'

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center p-6 text-center">
      <div className="space-y-4">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="text-3xl font-semibold">Página no encontrada</h1>
        <p className="text-muted-foreground">La ruta solicitada no existe dentro del scaffold.</p>
        <Button asChild><Link to={ROUTES.HOME}>Volver al inicio</Link></Button>
      </div>
    </main>
  )
}
