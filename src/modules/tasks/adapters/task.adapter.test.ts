import { describe, expect, it } from 'vitest'
import { adaptTask } from './task.adapter'

describe('adaptTask', () => {
  it('separa el contrato HTTP del modelo del dominio', () => {
    const task = adaptTask({
      id: 'task_1',
      title: 'Probar adapter',
      is_done: true,
      created_at: '2026-10-03T10:00:00.000Z',
    })

    expect(task).toEqual({
      id: 'task_1',
      title: 'Probar adapter',
      isDone: true,
      createdAt: new Date('2026-10-03T10:00:00.000Z'),
    })
  })
})
