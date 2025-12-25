import type { Category } from '../domain/category.types'
import type { CategoryDto } from './categories.dto'

export const mapCategoryDto = (dto: CategoryDto): Category => ({
    id: dto.id,
    name: dto.name,
    photoUrl: dto.photoUrl ?? null,
    createdAt: dto.createdAt
})