import { useMutation } from '@tanstack/react-query'
import { login } from '@/modules/auth/services'
import { useAuthStore } from '@/shared/stores'

export function useLogin() {
  const setAccessToken = useAuthStore(state => state.setAccessToken)

  return useMutation({
    mutationKey: ['auth', 'login'],
    mutationFn: login,
    onSuccess: result => setAccessToken(result.accessToken),
    meta: {
      skipGlobalErrorToast: true,
      skipErrorReporting: true,
    },
  })
}
