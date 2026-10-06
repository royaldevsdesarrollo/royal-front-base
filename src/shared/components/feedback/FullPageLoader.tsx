import { LoaderCircle } from 'lucide-react'

export function FullPageLoader({ label = 'Cargando aplicación' }: { label?: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-background p-6">
      <div className="flex items-center gap-3 text-sm text-muted-foreground" role="status">
        <LoaderCircle className="size-5 animate-spin" />
        <span>{label}</span>
      </div>
    </main>
  )
}
