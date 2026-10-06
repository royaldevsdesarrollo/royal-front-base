import { cn } from '@/shared/utils'

interface PageContainerProps extends React.ComponentProps<'div'> {
  title: string
  description?: string
}

export function PageContainer({ children, className, description, title, ...props }: PageContainerProps) {
  return (
    <div className={cn('w-full min-w-0 space-y-8 p-4 sm:p-6 lg:p-8', className)} {...props}>
      <header className="max-w-3xl space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
        {description && <p className="text-base text-muted-foreground sm:text-lg">{description}</p>}
      </header>
      {children}
    </div>
  )
}
