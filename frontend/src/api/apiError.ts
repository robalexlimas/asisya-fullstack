import type { AxiosError } from 'axios'

export type ApiError = {
    Code?: string
    Message?: string
    Detail?: string
    TraceId?: string
}

export function getApiErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        const data = error.response?.data as ApiError | undefined
        return data?.Message ?? error.message
    }

    if (error instanceof Error) {
        return error.message
    }

    return 'Unexpected error'
}

function isAxiosError(error: unknown): error is AxiosError {
    return typeof error === 'object' && error !== null && 'isAxiosError' in error
}