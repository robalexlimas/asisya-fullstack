import { http } from '@/core/api/http'

export interface LoginRequest {
    username: string
    password: string
}

export interface LoginResponse {
    token: string
}

export async function login(req: LoginRequest): Promise<LoginResponse> {
    try {
        const { data } = await http.post<LoginResponse>('/auth/login', req)
        console.log('login response', data)
        return data
    } catch (error) {
        console.log('login error', error)
        return { username: 'error', password: 'error' } as unknown as LoginResponse
    }
}