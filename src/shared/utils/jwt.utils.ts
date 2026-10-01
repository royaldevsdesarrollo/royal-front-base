interface JwtPayload {
  exp?: number
}

/**
 * Indica si un JWT está vencido o no contiene un claim `exp` válido.
 * Solo se usa para mejorar la experiencia; el servidor sigue siendo la autoridad.
 */
export function isJwtExpired(token: string): boolean {
  try {
    const payloadPart = token.split('.')[1]

    if (!payloadPart) {
      return true
    }

    const normalized = payloadPart.replaceAll('-', '+').replaceAll('_', '/')
    const padding = '='.repeat((4 - (normalized.length % 4)) % 4)
    const payload = JSON.parse(globalThis.atob(normalized + padding)) as JwtPayload

    return typeof payload.exp !== 'number' || payload.exp * 1000 <= Date.now()
  }
  catch {
    return true
  }
}
