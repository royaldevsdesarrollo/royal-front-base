import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/shared/config'
import { queryClient } from '@/shared/lib/api'
import { clearMonitoringUser } from '@/shared/lib/monitoring'
import { useAuthStore } from '@/shared/stores'

export function useLogout() {
  const navigate = useNavigate()

  return () => {
    useAuthStore.getState().clearSession()
    queryClient.clear()
    clearMonitoringUser()
    navigate(ROUTES.LOGIN, { replace: true })
  }
}
