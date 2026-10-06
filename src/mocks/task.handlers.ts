import { delay, http, HttpResponse } from 'msw'
import { API_ENDPOINTS, HTTP_STATUS } from '@/shared/config'
import type { CreateTaskInput, TaskDto } from '@/modules/tasks'

let tasks: TaskDto[] = [
  { id: 'task_1', title: 'Revisar la arquitectura del scaffold', is_done: true, created_at: '2026-10-01T09:00:00.000Z' },
  { id: 'task_2', title: 'Explorar el showcase de componentes', is_done: false, created_at: '2026-10-02T11:30:00.000Z' },
]

function unauthorized() {
  return HttpResponse.json(
    { message: 'Sesión no válida', statusCode: HTTP_STATUS.UNAUTHORIZED },
    { status: HTTP_STATUS.UNAUTHORIZED },
  )
}

function isAuthorized(request: Request): boolean {
  return request.headers.get('authorization')?.startsWith('Bearer ') === true
}

export const taskHandlers = [
  http.get(`*${API_ENDPOINTS.TASKS}`, async ({ request }) => {
    await delay(300)
    return isAuthorized(request) ? HttpResponse.json({ data: tasks }) : unauthorized()
  }),

  http.post(`*${API_ENDPOINTS.TASKS}`, async ({ request }) => {
    await delay(300)
    if (!isAuthorized(request)) {
      return unauthorized()
    }

    const input = await request.json() as CreateTaskInput
    const task: TaskDto = {
      id: crypto.randomUUID(),
      title: input.title,
      is_done: false,
      created_at: new Date().toISOString(),
    }
    tasks = [task, ...tasks]

    return HttpResponse.json({ data: task }, { status: 201 })
  }),

  http.patch(`*${API_ENDPOINTS.TASKS}/:taskId/toggle`, async ({ params, request }) => {
    await delay(250)
    if (!isAuthorized(request)) {
      return unauthorized()
    }

    const task = tasks.find(item => item.id === params.taskId)
    if (!task) {
      return HttpResponse.json({ message: 'Tarea no encontrada', statusCode: 404 }, { status: 404 })
    }

    task.is_done = !task.is_done
    return HttpResponse.json({ data: task })
  }),

  http.delete(`*${API_ENDPOINTS.TASKS}/:taskId`, async ({ params, request }) => {
    await delay(250)
    if (!isAuthorized(request)) {
      return unauthorized()
    }

    tasks = tasks.filter(item => item.id !== params.taskId)
    return new HttpResponse(null, { status: 204 })
  }),
]
