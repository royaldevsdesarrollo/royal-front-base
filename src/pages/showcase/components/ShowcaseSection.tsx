import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui'

interface ShowcaseSectionProps extends React.PropsWithChildren {
  title: string
  description: string
}

export function ShowcaseSection({ children, description, title }: ShowcaseSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
