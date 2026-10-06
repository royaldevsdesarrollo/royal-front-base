export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface LoginResult {
  accessToken: string
}

export interface LoginLocationState {
  from?: {
    pathname: string
  }
}
