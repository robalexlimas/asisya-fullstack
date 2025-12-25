import axios from 'axios'
import { env } from '@/config/env'
import { useAuthStore } from '@/store/auth.store'

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