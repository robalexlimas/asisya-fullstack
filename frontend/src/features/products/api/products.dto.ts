export interface ProductListItemDto {
  id: string
  name: string
  sku: string
  price: number
  categoryName: string
}

export interface ProductsPagedResponseDto {
  items: ProductListItemDto[]
  total: number
}

export type CreateProductRequestDto = {
  name: string
  sku: string
  price: number
  categoryId: string
}

export type CreateProductResponseDto = {
  id: string
}
