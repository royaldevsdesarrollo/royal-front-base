import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { LoaderCircle, LogIn } from 'lucide-react'
import { useLogin } from '@/modules/auth/hooks'
import { loginSchema } from '@/modules/auth/schemas'
import type { LoginFormData } from '@/modules/auth/schemas'
import { Alert, AlertDescription, Button, Input, Label } from '@/shared/components/ui'
import { getErrorMessage } from '@/shared/lib/api'

interface LoginFormProps {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const login = useLogin()
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'demo@royalstack.dev',
      password: 'demo1234',
    },
  })

  const submit = form.handleSubmit(data => login.mutate(data, { onSuccess }))

  return (
    <form className="space-y-5" onSubmit={(event) => { void submit(event) }} noValidate>
      {login.isError && (
        <Alert variant="destructive">
          <AlertDescription>{getErrorMessage(login.error)}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(form.formState.errors.email)}
          {...form.register('email')}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(form.formState.errors.password)}
          {...form.register('password')}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={login.isPending}>
        {login.isPending ? <LoaderCircle className="animate-spin" /> : <LogIn />}
        {login.isPending ? 'Ingresando...' : 'Ingresar'}
      </Button>
    </form>
  )
}
