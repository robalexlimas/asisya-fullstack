export type ImportJobListItemDto = {
    id: string
    status: string
    createdAt: string
    processedRows: number
    insertedRows: number
    failedRows: number
    totalRows: number
}

export type ImportJobsPagedDto = {
    page: number
    pageSize: number
    total: number
    items: ImportJobListItemDto[]
}

export type ImportJobDetailDto = ImportJobListItemDto & {
    error: string | null
}

export type JobsPagedResponse = {
    data: {
        page: number
        pageSize: number
        total: number
        items: JobStatusResponse[]
    },
    page: number
    pageSize: number
    total: number
    items: JobStatusResponse[]
}

export type JobStatus = 'Queued' | 'Processing' | 'Completed' | 'Failed'

export type JobStatusResponse = {
    jobId: string
    type: string
    status: JobStatus
    filename: string
    totalRows: number
    processedRows: number
    insertedRows: number
    failedRows: number
    error: string | null
    createdAt: string | null
    startedAt: string | null
    finishedAt: string | null
    updatedAt: string | null
    data: {
        jobId: string
        type: string
        status: JobStatus
        filename: string
        totalRows: number
        processedRows: number
        insertedRows: number
        failedRows: number
        error: string | null
        createdAt: string | null
        startedAt: string | null
        finishedAt: string | null
        updatedAt: string | null
    }
}

export type JobsHistoryItemDto = {
    jobId: string
    type: string
    status: JobStatus
    filename: string
    totalRows: number
    processedRows: number
    insertedRows: number
    failedRows: number
    error: string | null
    createdAt: string | null
    startedAt: string | null
    finishedAt: string | null
}

export type JobsHistoryResponse = {
    page: number
    pageSize: number
    total: number
    items: JobsHistoryItemDto[]
}
