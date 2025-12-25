import { http } from '@/core/api/http'
import type { CreateCategoryRequestDto, PagedCategoriesResponseDto, CategoryDto } from './categories.dto'

export const categoriesApi = {
    async getPaged(params: { page: number, pageSize: number, search?: string }): Promise<PagedCategoriesResponseDto> {
        const res = await http.get<PagedCategoriesResponseDto>('/category', { params })
        return res.data
    },

    async create(body: CreateCategoryRequestDto): Promise<CategoryDto> {
        const res = await http.post<CategoryDto>('/category', body)
        return res.data
    }
}