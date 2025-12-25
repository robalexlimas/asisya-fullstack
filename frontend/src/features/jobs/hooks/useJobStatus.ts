import { useQuery } from '@tanstack/react-query'
import { jobsApi } from '../api/jobs.api'
import type { JobStatusResponse } from '../api/jobs.dto'

const isTerminal = (s: string): boolean => s === 'Completed' || s === 'Failed'

type Options = {
    enabled?: boolean
}

export function useJobStatus(jobId: string | null, options?: Options) {
    const enabled =
        options?.enabled ??
        (jobId != null && jobId.trim().length > 0)

    return useQuery<JobStatusResponse>({
        queryKey: ['job', jobId],
        queryFn: async () => {
            if (jobId == null || jobId.trim().length === 0) {
                throw new Error('jobId is required')
            }
            return await jobsApi.getById(jobId)
        },
        enabled,
        refetchInterval: (q) => {
            const status = q.state.data?.status
            if (status == null) return 1500
            return isTerminal(status) ? false : 1500
        }
    })
}
