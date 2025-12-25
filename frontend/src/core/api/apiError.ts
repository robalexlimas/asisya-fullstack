import axios from 'axios'
import toast from 'react-hot-toast'

export type ApiError = {
    code: string
    message: string
    detail?: string
    traceId?: string
    status?: number
}

export function toApiError(err: unknown): ApiError {
    if (axios.isAxiosError(err)) {
        const data = err.response?.data as Partial<ApiError> | undefined

        return {
            code: data?.code ?? 'http_error',
            message: data?.message ?? err.message ?? 'Request failed',
            detail: data?.detail,
            traceId: data?.traceId,
            status: err.response?.status
        }
    }

    if (err instanceof Error) {
        return { code: 'client_error', message: err.message }
    }

    return { code: 'unknown_error', message: 'Unexpected error' }
}

export function getApiErrorMessage(err: unknown): string {
    return toApiError(err).message
}

export function notifyApiError(err: unknown, fallbackMessage?: string): void {
    const apiErr = toApiError(err)
    toast.error(apiErr.message || fallbackMessage || 'Unexpected error')
}