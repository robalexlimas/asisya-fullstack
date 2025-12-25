import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../api/products.api'

interface Args {
  page: number
  pageSize: number
  search?: string
  categoryId?: string
}

export function useProducts (args: Args) {
  return useQuery({
    queryKey: ['products', args],
    queryFn: async () => await getProducts(args),
    staleTime: 30_000
  })
}
