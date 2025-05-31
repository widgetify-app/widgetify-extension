import { getMainClient } from '@/services/api'
import { useMutation } from '@tanstack/react-query'

interface LoginCredentials {
  password: string
  email: string
}

interface AuthResponse {
  statusCode: number
  message: string | null
  data: string // token
}

async function signIn(credentials: LoginCredentials): Promise<AuthResponse> {
  const client = await getMainClient()
  const response = await client.post<AuthResponse>('/auth/signin', credentials)
  return response.data
}

export function useSignIn() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => signIn(credentials),
  })
}
