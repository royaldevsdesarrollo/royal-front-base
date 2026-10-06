import { useMutation, useQuery } from '@tanstack/react-query'
import { createTask, deleteTask, getTasks, toggleTask } from '@/modules/tasks/services'
import { QUERY_KEYS } from '@/shared/config'
import { queryClient } from '@/shared/lib/api'

function invalidateTasks(): Promise<void> {
  return queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TASKS })
}

export function useTasks() {
  return useQuery({
    queryKey: QUERY_KEYS.TASKS,
    queryFn: getTasks,
  })
}

export function useCreateTask() {
  return useMutation({
    mutationFn: createTask,
    onSuccess: invalidateTasks,
    meta: { errorMessage: 'No fue posible crear la tarea' },
  })
}

export function useToggleTask() {
  return useMutation({
    mutationFn: toggleTask,
    onSuccess: invalidateTasks,
    meta: { errorMessage: 'No fue posible actualizar la tarea' },
  })
}

export function useDeleteTask() {
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: invalidateTasks,
    meta: { errorMessage: 'No fue posible eliminar la tarea' },
  })
}
