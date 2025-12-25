import { useMutation } from '@tanstack/react-query'
import { importApi } from '../api/import.api'

export function useCreateImportJob() {
    return useMutation({
        mutationFn: async (file: File) => {
            return await importApi.create(file)
        }
    })
}
