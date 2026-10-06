import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().trim().min(3, 'Escribe al menos 3 caracteres').max(80, 'Usa máximo 80 caracteres'),
})

export type CreateTaskFormData = z.infer<typeof createTaskSchema>
