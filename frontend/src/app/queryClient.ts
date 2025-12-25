import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { notifyApiError } from '@/api/apiError'

export const queryClient = new QueryClient({
    queryCache: new QueryCache({
        onError: (error) => {
            notifyApiError(error)
        }
    }),
    mutationCache: new MutationCache({
        onError: (error) => {
            notifyApiError(error)
        }
    }),
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false
        }
    }
})