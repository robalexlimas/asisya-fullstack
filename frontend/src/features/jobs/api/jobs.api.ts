import { http } from '@/core/api/http'
import type { JobStatusResponse, JobsPagedResponse } from './jobs.dto'

export const jobsApi = {
    getById: async (jobId: string): Promise<JobStatusResponse> => {
        return await http.get(`/jobs/${jobId}`)
    },
    getPaged: async (page: number, pageSize: number): Promise<JobsPagedResponse> => {
        return await http.get(`/jobs?page=${page}&pageSize=${pageSize}`)
    }
}
