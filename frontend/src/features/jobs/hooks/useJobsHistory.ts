import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { jobsApi } from '../api/jobs.api'
import type { JobsPagedResponse } from '../api/jobs.dto'

type Params = {
    page: number
    pageSize: number
}

export function useJobsHistory(params: Params) {
    return useQuery<JobsPagedResponse>({
        queryKey: ['jobs', params.page, params.pageSize],
        queryFn: async () => await jobsApi.getPaged(params.page, params.pageSize),
        placeholderData: keepPreviousData
    })
}
