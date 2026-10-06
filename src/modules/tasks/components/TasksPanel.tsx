import { CreateTaskForm } from './CreateTaskForm'
import { TaskList } from './TaskList'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui'

export function TasksPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lista de tareas</CardTitle>
        <CardDescription>Las operaciones usan hooks, services, adapters, Axios, TanStack Query y handlers de MSW.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CreateTaskForm />
        <TaskList />
      </CardContent>
    </Card>
  )
}
