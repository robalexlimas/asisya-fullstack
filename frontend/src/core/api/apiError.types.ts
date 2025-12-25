export interface ApiError {
    status: number
    code: string
    message: string
    detail?: string
}