import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ProductCreate, ProductCreated } from '../domain/product.types'
import { createProduct } from '../api/products.api'
import { toCreateProductRequestDto, toProductCreated } from '../api/products.mapper'

export function useCreateProduct() {
    const qc = useQueryClient()

    return useMutation<ProductCreated, Error, ProductCreate>({
        mutationFn: async (input) => {
            const dto = await createProduct(toCreateProductRequestDto(input))
            return toProductCreated(dto)
        },
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: ['products'] })
        }
    })
}
