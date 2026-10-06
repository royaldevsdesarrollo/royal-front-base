import { delay, http, HttpResponse } from 'msw'
import { API_ENDPOINTS, HTTP_STATUS } from '@/shared/config'
import type { AuthUser, LoginInput } from '@/modules/auth'

const MOCK_USER: AuthUser = {
  id: 'usr_demo_001',
  name: 'Usuario Demo',
  email: 'demo@royalstack.dev',
  role: 'Administrador',
}

function encodeBase64Url(value: object): string {
  return btoa(JSON.stringify(value))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function createAccessToken(): string {
  const now = Math.floor(Date.now() / 1000)
  const header = encodeBase64Url({ alg: 'none', typ: 'JWT' })
  const payload = encodeBase64Url({
    sub: MOCK_USER.id,
    email: MOCK_USER.email,
    iat: now,
    exp: now + 60 * 60,
  })

  return `${header}.${payload}.mock-signature`
}

function hasBearerToken(request: Request): boolean {
  return request.headers.get('authorization')?.startsWith('Bearer ') === true
}

export const authHandlers = [
  http.post(`*${API_ENDPOINTS.AUTH.LOGIN}`, async ({ request }) => {
    await delay(450)
    const credentials = await request.json() as LoginInput

    if (
      credentials.email !== 'demo@royalstack.dev'
      || credentials.password !== 'demo1234'
    ) {
      return HttpResponse.json(
        { message: 'El correo o la contraseña son incorrectos', statusCode: HTTP_STATUS.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED },
      )
    }

    return HttpResponse.json({
      data: { accessToken: createAccessToken() },
      message: 'Sesión iniciada',
    })
  }),

  http.get(`*${API_ENDPOINTS.AUTH.ME}`, async ({ request }) => {
    await delay(250)

    if (!hasBearerToken(request)) {
      return HttpResponse.json(
        { message: 'Sesión no válida', statusCode: HTTP_STATUS.UNAUTHORIZED },
        { status: HTTP_STATUS.UNAUTHORIZED },
      )
    }

    return HttpResponse.json({ data: MOCK_USER })
  }),
]
