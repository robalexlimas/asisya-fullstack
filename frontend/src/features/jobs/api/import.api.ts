import { http } from '@/core/api/http'

export type CreateImportJobResponse = {
    jobId: string
    status: 'Queued' | 'Processing' | 'Completed' | 'Failed'
}

export const importApi = {
    create: async (file: File): Promise<CreateImportJobResponse> => {
        const form = new FormData()
        form.append('file', file) // 👈 la key que usa el backend

        return await http.post('/products/import', form, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    }
}
