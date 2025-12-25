import axios, { AxiosError, AxiosInstance } from 'axios'
import { env } from '@/config/env'
import { useAuthStore } from '@/store/auth.store'
import { ApiError, normalizeApiError } from './apiError'

export const http: AxiosInstance = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: 30_000,
    headers: {
        'Content-Type': 'application/json'
    }
})

/**
 * Request interceptor
 * - Injects JWT token if present
 */
http.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token

    if (token != null) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

/**
 * Response interceptor
 * - Normalizes API errors
 * - Clears auth on 401
 */
http.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        const apiError: ApiError = normalizeApiError(error)

        if (apiError.status === 401) {
            useAuthStore.getState().clear()
        }

        return Promise.reject(apiError)
    }
)