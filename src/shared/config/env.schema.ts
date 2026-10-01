import { z } from 'zod'

const optionalString = z.preprocess(
  value => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  z.string().optional(),
)

const booleanString = z
  .enum(['true', 'false'])
  .default('false')
  .transform(value => value === 'true')

export const envSchema = z
  .object({
    VITE_API_URL: z.string().min(1).default('/api'),
    VITE_API_TIMEOUT_MS: z.coerce.number().int().positive().default(15_000),
    VITE_SENTRY_ENABLED: booleanString,
    VITE_SENTRY_DSN: optionalString,
    VITE_SENTRY_ENVIRONMENT: z.string().min(1),
    VITE_SENTRY_RELEASE: z.string().min(1).default('local'),
  })
  .superRefine((env, context) => {
    if (env.VITE_SENTRY_ENABLED && !env.VITE_SENTRY_DSN) {
      context.addIssue({
        code: 'custom',
        path: ['VITE_SENTRY_DSN'],
        message: 'VITE_SENTRY_DSN es obligatorio cuando Sentry está habilitado',
      })
    }
  })
