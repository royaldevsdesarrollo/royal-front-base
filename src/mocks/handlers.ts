import { authHandlers } from './auth.handlers'
import { taskHandlers } from './task.handlers'

export const handlers = [...authHandlers, ...taskHandlers]
