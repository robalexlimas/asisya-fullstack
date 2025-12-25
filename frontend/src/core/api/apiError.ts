import { AxiosError } from 'axios'

export interface ApiError {
    status: number
    code: string
    message: string
    detail?: string
}

/**
 * Transforms AxiosError into a normalized ApiError
 */
export function normalizeApiError(error: unknown): ApiError {
    if (error instanceof AxiosError) {
        const status = error.response?.status ?? 0
        const data = error.response?.data as {
            Code?: string
            Message?: string
            Detail?: string
        } | undefined

        return {
            status,
            code: data?.Code ?? 'unknown_error',
            message: data?.Message ?? error.message,
            detail: data?.Detail
        }
    }

    if (error instanceof Error) {
        return {
            status: 0,
            code: 'unexpected_error',
            message: error.message
        }
    }

    return {
        status: 0,
        code: 'unknown_error',
        message: 'Unexpected error'
    }
}

/**
 * Helper for UI
 */
export function getApiErrorMessage(error: unknown): string {
    const apiError = normalizeApiError(error)
    return apiError.message
}