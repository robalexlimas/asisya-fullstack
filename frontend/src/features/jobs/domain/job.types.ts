export type ImportJobStatus = 'Queued' | 'Processing' | 'Completed' | 'Failed'

export type ImportJobListItem = {
    jobId: string
    status: string
    totalRows: number
    processedRows: number
    insertedRows: number
    failedRows: number
    error: string | null
    createdAt?: string | null
    startedAt?: string | null
    finishedAt?: string | null
}

export type ImportJobDetail = ImportJobListItem & {
    error: string | null
}
