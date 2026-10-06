import { QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { LoginForm } from './LoginForm'
import { queryClient } from '@/shared/lib/api'
import { useAuthStore } from '@/shared/stores'

function renderLoginForm(onSuccess = vi.fn()) {
  render(
    <QueryClientProvider client={queryClient}>
      <LoginForm onSuccess={onSuccess} />
    </QueryClientProvider>,
  )

  return onSuccess
}

describe('LoginForm', () => {
  it('inicia una sesión con las credenciales del mock', async () => {
    const user = userEvent.setup()
    const onSuccess = renderLoginForm()

    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByRole('button', { name: 'Ingresar' })).toBeEnabled()
    expect(onSuccess).toHaveBeenCalledOnce()
    expect(useAuthStore.getState().accessToken).toContain('.')
  })

  it('muestra el error normalizado para credenciales inválidas', async () => {
    const user = userEvent.setup()
    const onSuccess = renderLoginForm()
    const password = screen.getByLabelText('Contraseña')

    await user.clear(password)
    await user.type(password, 'incorrecta')
    await user.click(screen.getByRole('button', { name: 'Ingresar' }))

    expect(await screen.findByText('El correo o la contraseña son incorrectos')).toBeVisible()
    expect(onSuccess).not.toHaveBeenCalled()
    expect(useAuthStore.getState().accessToken).toBeNull()
  })
})
