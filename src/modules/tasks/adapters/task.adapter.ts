import type { Task, TaskDto } from '@/modules/tasks/types'

export function adaptTask(dto: TaskDto): Task {
  return {
    id: dto.id,
    title: dto.title,
    isDone: dto.is_done,
    createdAt: new Date(dto.created_at),
  }
}
