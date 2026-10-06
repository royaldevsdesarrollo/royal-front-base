import { ArrowRight, Blocks, Braces, LockKeyhole, MonitorCog } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageContainer } from '@/shared/components'
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui'
import { ROUTES } from '@/shared/config'

const CAPABILITIES = [
  { icon: LockKeyhole, title: 'Auth listo', description: 'Sesión persistida, rutas protegidas y manejo centralizado de 401.' },
  { icon: Braces, title: 'Datos tipados', description: 'Axios, TanStack Query, Zod y errores normalizados.' },
  { icon: Blocks, title: 'Arquitectura modular', description: 'Límites claros entre páginas, módulos e infraestructura compartida.' },
  { icon: MonitorCog, title: 'Operación incluida', description: 'Mocks, monitoreo opcional, lint estricto y build reproducible.' },
] as const

export function HomePage() {
  return (
    <PageContainer
      title="Una base frontend lista para crecer"
      description="Royal Stack Web reúne las decisiones repetitivas de un proyecto React en un scaffold modular, verificable y fácil de adaptar."
    >
      <div className="flex flex-wrap gap-3">
        <Button asChild size="lg">
          <Link to={ROUTES.SHOWCASE}>
            Explorar componentes
            <ArrowRight />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to={ROUTES.EXAMPLE}>Ver módulo de ejemplo</Link>
        </Button>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Capacidades del scaffold">
        {CAPABILITIES.map(({ description, icon: Icon, title }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="size-5 text-primary" />
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="rounded-xl border bg-card p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <h2 className="mr-auto text-xl font-semibold">Stack principal</h2>
          <Badge>React 19</Badge>
          <Badge variant="secondary">TypeScript</Badge>
        </div>
        <p className="max-w-3xl text-muted-foreground">
          Vite, Tailwind CSS, shadcn, React Router, TanStack Query, Zustand, React Hook Form,
          Zod, Axios, MSW y Sentry opcional.
        </p>
      </section>
    </PageContainer>
  )
}
