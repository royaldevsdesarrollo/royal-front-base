import { ArrowDown } from 'lucide-react'
import { TasksPanel } from '@/modules/tasks'
import { PageContainer } from '@/shared/components'
import { Badge } from '@/shared/components/ui'

const FLOW = ['Component', 'Hook', 'Service', 'apiClient', 'MSW / Backend'] as const

export function ExamplePage() {
  return (
    <PageContainer title="Módulo de ejemplo" description="Un dominio neutral que demuestra el flujo de datos completo sin acoplar los componentes a HTTP.">
      <div className="flex flex-wrap items-center gap-2" aria-label="Flujo de datos del módulo">
        {FLOW.map((step, index) => (
          <span key={step} className="contents">
            <Badge variant="outline">{step}</Badge>
            {index < FLOW.length - 1 && <ArrowDown className="size-3 -rotate-90 text-muted-foreground" />}
          </span>
        ))}
      </div>
      <div className="max-w-3xl"><TasksPanel /></div>
    </PageContainer>
  )
}
