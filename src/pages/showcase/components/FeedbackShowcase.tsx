import { CircleCheck, Info } from 'lucide-react'
import { toast } from 'sonner'
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Badge,
  Button,
  Progress,
  Skeleton,
} from '@/shared/components/ui'
import { ShowcaseSection } from './ShowcaseSection'

export function FeedbackShowcase() {
  return (
    <ShowcaseSection title="Feedback y estados" description="Mensajes, progreso, carga y notificaciones.">
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
        <Alert>
          <Info />
          <AlertTitle>Información</AlertTitle>
          <AlertDescription>Los componentes mantienen una jerarquía visual consistente.</AlertDescription>
        </Alert>
        <Alert variant="destructive">
          <CircleCheck />
          <AlertTitle>Revisión requerida</AlertTitle>
          <AlertDescription>Ejemplo de un estado que necesita atención.</AlertDescription>
        </Alert>
        <div className="space-y-2">
          <p className="text-sm font-medium">Progreso del proceso</p>
          <Progress value={68} />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-40" />
            <Skeleton className="h-3 w-28" />
          </div>
        </div>
        <Button type="button" variant="outline" onClick={() => toast.success('Los cambios fueron guardados')}>Mostrar toast</Button>
      </div>
    </ShowcaseSection>
  )
}
