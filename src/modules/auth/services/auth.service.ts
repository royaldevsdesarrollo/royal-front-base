import { apiClient, publicApiClient } from '@/shared/lib/api'
import { API_ENDPOINTS } from '@/shared/config'
import type { ApiResponse } from '@/shared/types'
import type { AuthUser, LoginInput, LoginResult } from '@/modules/auth/types'

export async function login(input: LoginInput): Promise<LoginResult> {
  const response = await publicApiClient.post<ApiResponse<LoginResult>>(
    API_ENDPOINTS.AUTH.LOGIN,
    input,
  )

  return response.data.data
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await apiClient.get<ApiResponse<AuthUser>>(API_ENDPOINTS.AUTH.ME)
  return response.data.data
}
