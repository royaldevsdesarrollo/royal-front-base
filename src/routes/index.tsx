import { lazy, Suspense } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import { AuthenticatedLayout } from '@/modules/auth'
import { FullPageLoader } from '@/shared/components'
import { ROUTES } from '@/shared/config'

const LoginPage = lazy(() => import('@/pages/auth').then(module => ({ default: module.LoginPage })))
const HomePage = lazy(() => import('@/pages/home').then(module => ({ default: module.HomePage })))
const ShowcasePage = lazy(() => import('@/pages/showcase').then(module => ({ default: module.ShowcasePage })))
const ExamplePage = lazy(() => import('@/pages/example').then(module => ({ default: module.ExamplePage })))
const NotFoundPage = lazy(() => import('@/pages/errors').then(module => ({ default: module.NotFoundPage })))

function lazyElement(element: React.ReactNode) {
  return <Suspense fallback={<FullPageLoader label="Cargando página" />}>{element}</Suspense>
}

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: lazyElement(<LoginPage />),
  },
  {
    element: <AuthenticatedLayout />,
    children: [
      { path: ROUTES.HOME, element: lazyElement(<HomePage />) },
      { path: ROUTES.SHOWCASE, element: lazyElement(<ShowcasePage />) },
      { path: ROUTES.EXAMPLE, element: lazyElement(<ExamplePage />) },
    ],
  },
  {
    path: '*',
    element: lazyElement(<NotFoundPage />),
  },
])
