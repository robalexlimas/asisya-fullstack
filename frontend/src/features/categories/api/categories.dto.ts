export type CategoryDto = {
    id: string
    name: string
    photoUrl: string | null
    createdAt: string
}

export type CreateCategoryRequestDto = {
    name: string
    photoUrl?: string | null
}

export type PagedCategoriesResponseDto = {
    page: number
    pageSize: number
    total: number
    items: CategoryDto[]
}