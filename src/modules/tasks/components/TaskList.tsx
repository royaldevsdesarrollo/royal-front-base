import { Circle, CircleCheck, ListTodo, LoaderCircle, Trash2 } from 'lucide-react'
import { useDeleteTask, useTasks, useToggleTask } from '@/modules/tasks/hooks'
import { Alert, AlertDescription, AlertTitle, Button, Skeleton } from '@/shared/components/ui'
import { getErrorMessage } from '@/shared/lib/api'

export function TaskList() {
  const tasks = useTasks()
  const toggleTask = useToggleTask()
  const deleteTask = useDeleteTask()

  if (tasks.isPending) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    )
  }

  if (tasks.isError) {
    return (
      <Alert variant="destructive">
        <AlertTitle>No fue posible cargar las tareas</AlertTitle>
        <AlertDescription>{getErrorMessage(tasks.error)}</AlertDescription>
      </Alert>
    )
  }

  if (tasks.data.length === 0) {
    return (
      <div className="grid place-items-center rounded-xl border border-dashed p-10 text-center">
        <ListTodo className="mb-3 size-8 text-muted-foreground" />
        <p className="font-medium">No hay tareas</p>
        <p className="text-sm text-muted-foreground">Agrega la primera para probar el flujo completo.</p>
      </div>
    )
  }

  return (
    <ul className="divide-y rounded-xl border">
      {tasks.data.map((task) => {
        const isUpdating = toggleTask.isPending && toggleTask.variables === task.id
        const isDeleting = deleteTask.isPending && deleteTask.variables === task.id

        return (
          <li key={task.id} className="flex items-center gap-3 p-3">
            <Button type="button" variant="ghost" size="icon" aria-label={task.isDone ? 'Marcar como pendiente' : 'Marcar como completada'} disabled={isUpdating} onClick={() => toggleTask.mutate(task.id)}>
              {isUpdating ? <LoaderCircle className="animate-spin" /> : task.isDone ? <CircleCheck className="text-primary" /> : <Circle />}
            </Button>
            <div className="min-w-0 flex-1">
              <p className={task.isDone ? 'truncate text-muted-foreground line-through' : 'truncate font-medium'}>{task.title}</p>
              <p className="text-xs text-muted-foreground">{task.createdAt.toLocaleDateString('es')}</p>
            </div>
            <Button type="button" variant="ghost" size="icon" aria-label="Eliminar tarea" disabled={isDeleting} onClick={() => deleteTask.mutate(task.id)}>
              {isDeleting ? <LoaderCircle className="animate-spin" /> : <Trash2 />}
            </Button>
          </li>
        )
      })}
    </ul>
  )
}
