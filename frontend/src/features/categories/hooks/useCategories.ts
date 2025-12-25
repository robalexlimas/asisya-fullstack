import { useQuery } from '@tanstack/react-query'
import { categoriesApi } from '../api/categories.api'
import { mapCategoryDto } from '../api/categories.mapper'

export const useCategories = (params: { page: number, pageSize: number, search?: string }) => {
    return useQuery({
        queryKey: ['categories', params],
        queryFn: async () => {
            const dto = await categoriesApi.getPaged(params)
            return {
                ...dto,
                items: dto.items.map(mapCategoryDto)
            }
        },
        staleTime: 30_000
    })
}