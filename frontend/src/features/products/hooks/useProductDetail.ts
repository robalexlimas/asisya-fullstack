import { useQuery } from '@tanstack/react-query'
import { productApi } from '../services/product.api'

export function useProductDetail(id: string) {
    return useQuery({
        queryKey: ['product', id],
        queryFn: async () => await productApi.getById(id),
        enabled: id.trim().length > 0
    })
}
