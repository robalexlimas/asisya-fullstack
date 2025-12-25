import axios from 'axios'
import { env } from '@/config/env'
import { useAuthStore } from '@/store/auth.store'
import { notifyApiError } from '@/api/apiError'

export const http = axios.create({
  baseURL: env.apiBaseUrl
})

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    // Si quieres NO toastear el login fallido, puedes filtrar por URL:
    const url = String(error?.config?.url ?? '')
    const isLogin = url.includes('/auth/login')

    if (!isLogin) notifyApiError(error)

    return await Promise.reject(error)
  }
)
