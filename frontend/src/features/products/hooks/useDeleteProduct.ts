import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi } from '../services/product.api'

export function useDeleteProduct() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => productApi.delete(id),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['products'] })
        }
    })
}
