import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MainLayout } from './MainLayout'
import { TooltipProvider } from '@/shared/components/ui'
import { APP_STORAGE_KEYS } from '@/shared/config'
import { useAppStore } from '@/shared/stores'

const TEST_USER = {
  email: 'demo@royalstack.dev',
  name: 'Usuario Demo',
  role: 'Administrador',
}

function renderLayout(initialEntry = '/showcase', onLogout = vi.fn()) {
  render(
    <MemoryRouter
      initialEntries={[initialEntry]}
      future={{ v7_relativeSplatPath: true, v7_startTransition: true }}
    >
      <TooltipProvider>
        <Routes>
          <Route element={<MainLayout user={TEST_USER} onLogout={onLogout} />}>
            <Route path="*" element={<div>Contenido protegido</div>} />
          </Route>
        </Routes>
      </TooltipProvider>
    </MemoryRouter>,
  )

  return onLogout
}

describe('MainLayout', () => {
  it('marca la ruta activa y utiliza todo el contenido disponible', () => {
    renderLayout()
    const activeLink = screen
      .getAllByRole('link', { name: 'Showcase' })
      .find(link => link.dataset.sidebar === 'menu-button')

    expect(activeLink).toHaveAttribute('data-active', 'true')
    expect(screen.getByText('Contenido protegido')).toBeVisible()
    expect(screen.getByRole('main')).toHaveClass('min-w-0')
  })

  it('persiste la preferencia al colapsar el sidebar', async () => {
    const user = userEvent.setup()
    renderLayout()

    await user.click(screen.getByRole('button', { name: 'Alternar navegación' }))

    expect(useAppStore.getState().sidebarOpen).toBe(false)

    const persisted = JSON.parse(
      localStorage.getItem(APP_STORAGE_KEYS.APP) ?? '{}',
    ) as { state?: { sidebarOpen?: boolean } }
    expect(persisted.state?.sidebarOpen).toBe(false)
  })

  it('expone el cierre de sesión desde el footer', async () => {
    const user = userEvent.setup()
    const onLogout = renderLayout('/showcase')

    await user.click(screen.getByRole('button', { name: 'Cerrar sesión' }))
    expect(onLogout).toHaveBeenCalledOnce()
  })
})
