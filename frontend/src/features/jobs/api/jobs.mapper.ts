import type { ImportJobDetail, ImportJobListItem, ImportJobStatus } from '../domain/job.types'
import type { ImportJobDetailDto, ImportJobListItemDto } from './jobs.dto'

const toStatus = (s: string): ImportJobStatus => {
    if (s === 'Queued' || s === 'Processing' || s === 'Completed' || s === 'Failed') return s
    return 'Queued'
}

export const jobsMapper = {
    toListItem: (dto: ImportJobListItemDto): ImportJobListItem => ({
        id: dto.id,
        status: toStatus(dto.status),
        createdAt: dto.createdAt,
        processedRows: dto.processedRows,
        insertedRows: dto.insertedRows,
        failedRows: dto.failedRows,
        totalRows: dto.totalRows
    }),

    toDetail: (dto: ImportJobDetailDto): ImportJobDetail => ({
        id: dto.id,
        status: toStatus(dto.status),
        createdAt: dto.createdAt,
        processedRows: dto.processedRows,
        insertedRows: dto.insertedRows,
        failedRows: dto.failedRows,
        totalRows: dto.totalRows,
        error: dto.error ?? null
    })
}
