import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { notifyApiError } from '@/core/api/apiError'
import { categoriesApi } from '../api/categories.api'
import type { CategoryCreate } from '../domain/category.types'

export const useCreateCategory = () => {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async (input: CategoryCreate) => {
            return await categoriesApi.create({
                name: input.name,
                photoUrl: input.photoUrl ?? null
            })
        },
        onSuccess: async () => {
            toast.success('Categoría creada')
            await qc.invalidateQueries({ queryKey: ['categories'] })
        },
        onError: (err) => {
            notifyApiError(err)
        }
    })
}