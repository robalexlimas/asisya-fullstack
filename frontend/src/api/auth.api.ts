import { http } from '@/api/http'

export interface LoginRequest { username: string, password: string }
export interface LoginResponse { token: string }

export async function loginApi (req: LoginRequest): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>('/auth/login', req)
  return data
}
