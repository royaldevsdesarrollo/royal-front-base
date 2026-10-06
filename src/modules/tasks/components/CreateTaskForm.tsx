import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { LoaderCircle, Plus } from 'lucide-react'
import { useCreateTask } from '@/modules/tasks/hooks'
import { createTaskSchema } from '@/modules/tasks/schemas'
import type { CreateTaskFormData } from '@/modules/tasks/schemas'
import { Button, Input, Label } from '@/shared/components/ui'

export function CreateTaskForm() {
  const createTask = useCreateTask()
  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: { title: '' },
  })

  const submit = form.handleSubmit(data => createTask.mutate(data, {
    onSuccess: () => form.reset(),
  }))

  return (
    <form className="space-y-2" onSubmit={(event) => { void submit(event) }} noValidate>
      <Label htmlFor="task-title">Nueva tarea</Label>
      <div className="flex gap-2">
        <Input id="task-title" placeholder="Ej. Documentar un nuevo módulo" aria-invalid={Boolean(form.formState.errors.title)} {...form.register('title')} />
        <Button type="submit" disabled={createTask.isPending}>
          {createTask.isPending ? <LoaderCircle className="animate-spin" /> : <Plus />}
          <span className="hidden sm:inline">Agregar</span>
        </Button>
      </div>
      {form.formState.errors.title && <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>}
    </form>
  )
}
