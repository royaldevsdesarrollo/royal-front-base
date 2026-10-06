export interface TaskDto {
  id: string
  title: string
  is_done: boolean
  created_at: string
}

export interface Task {
  id: string
  title: string
  isDone: boolean
  createdAt: Date
}

export interface CreateTaskInput {
  title: string
}
