import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productApi } from '../services/product.api'

export function useUpdateProduct() {
    const qc = useQueryClient()

    return useMutation({
        mutationFn: async (p: { id: string, name: string, price: number, categoryId: string }) => {
            await productApi.update(p.id, {
                name: p.name,
                price: p.price,
                categoryId: p.categoryId
            })
        },
        onSuccess: async (_data, vars) => {
            await Promise.all([
                qc.invalidateQueries({ queryKey: ['products'] }),
                qc.invalidateQueries({ queryKey: ['product', vars.id] })
            ])
        }
    })
}