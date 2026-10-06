import { adaptTask } from '@/modules/tasks/adapters'
import type { CreateTaskInput, Task, TaskDto } from '@/modules/tasks/types'
import { API_ENDPOINTS } from '@/shared/config'
import { apiClient } from '@/shared/lib/api'
import type { ApiResponse } from '@/shared/types'

export async function getTasks(): Promise<Task[]> {
  const response = await apiClient.get<ApiResponse<TaskDto[]>>(API_ENDPOINTS.TASKS)
  return response.data.data.map(adaptTask)
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await apiClient.post<ApiResponse<TaskDto>>(API_ENDPOINTS.TASKS, input)
  return adaptTask(response.data.data)
}

export async function toggleTask(taskId: string): Promise<Task> {
  const response = await apiClient.patch<ApiResponse<TaskDto>>(`${API_ENDPOINTS.TASKS}/${taskId}/toggle`)
  return adaptTask(response.data.data)
}

export async function deleteTask(taskId: string): Promise<void> {
  await apiClient.delete(`${API_ENDPOINTS.TASKS}/${taskId}`)
}
