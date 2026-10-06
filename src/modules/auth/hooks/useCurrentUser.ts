import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCurrentUser } from '@/modules/auth/services'
import { QUERY_KEYS } from '@/shared/config'
import { clearMonitoringUser, setMonitoringUser } from '@/shared/lib/monitoring'

export function useCurrentUser(enabled = true) {
  const query = useQuery({
    queryKey: QUERY_KEYS.AUTH,
    queryFn: getCurrentUser,
    enabled,
    retry: false,
    meta: { skipErrorReporting: true },
  })

  useEffect(() => {
    if (query.data) {
      setMonitoringUser({ id: query.data.id })
    }

    return () => {
      if (!enabled) {
        clearMonitoringUser()
      }
    }
  }, [enabled, query.data])

  return query
}
